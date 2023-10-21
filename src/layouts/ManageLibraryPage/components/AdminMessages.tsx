import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react"
import AdminMessageRequest from "../../../models/AdminMessageRequest";
import MessageModel from "../../../models/MessageModel";
import { Pagination } from "../../Utils/Pagination";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { AdminMessage } from "./AdminMessage";

//the first thing  

export const AdminMessages = () => {
    const { authState } = useOktaAuth();

    const [isLoadingMessages, setIsLoadingMessages] = useState(true)
    const [httpError, setHttpError] = useState(null)

    //Message endpoint State
    const [messages, setMessages] = useState<MessageModel[]>([])
    const [messagesPerPage] = useState(5);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0)
    console.log(authState)
    // Recall useEffect 
    const [btnSubmit, setBtnSubmit] = useState(false)

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `http://localhost:8080/api/messages/search/findByClosed/?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const requestOptions = {
                    method: 'GET',
                    headers:
                    {
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                        'Content-type': 'application/json'
                    }
                }
                const messageResponse = await fetch(url, requestOptions);
                if (!messageResponse.ok) {
                    throw new Error('Something went wrong!')
                }
                console.log(messageResponse)
                const messagesResponseJson = await messageResponse.json()
                setMessages(messagesResponseJson._embedded.messages);
                setTotalPages(messagesResponseJson.page.totalPages);
            }

            setIsLoadingMessages(false);


        }


        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false)
            setHttpError(error.message)
        })
        window.scrollTo(0, 0)
    }, [authState, currentPage, btnSubmit]);

    if (isLoadingMessages) {
        return <SpinnerLoading />
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function submitResponseToQuestion(id: number, response: string) {
        const url = 'http://localhost:8080/api/messages/secure/admin/message';
        if (authState && authState.isAuthenticated) {
            const messageAdminRequestModel: AdminMessageRequest = new AdminMessageRequest(id, response);
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                    'Content-type': 'text/json'
                },
                Body : JSON.stringify(messageAdminRequestModel)

            }
            const messageAdminRequestModelResponse=await fetch(url,requestOptions)
            if(!messageAdminRequestModel.response){
                throw new Error('Something went wrong')
            }
            setBtnSubmit(!btnSubmit)

        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-3">
            {messages.length > 0 ?
                <>
                    {console.log(messages.length)}
                    <h5>Pending Q/A</h5>
                    {messages.map(message => (
                        <AdminMessage message={message} key={message.id} />
                    ))}
                </> :
                <h5>No pending Q/A</h5>
            }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </div>
    )
}