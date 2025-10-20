import {useState} from "react";


export default function CommentInputSend(){
    const [value, setValue] = useState("");

    /**
     * 发送评论
     */
    const sendComment = () => {
        console.log("value=", value)
    }

    return      <div className={"comment-input-send-container flex-1 relative"}>
        <div className={"comment-input-container pb-7"}>
                    <textarea className={"comment-input bg-gray-100 w-full py-2 px-4"}
                              placeholder={"请输入评论"}
                              value={value}
                              maxLength={1000}
                              rows={4}
                              onInput={(e) => setValue(e.currentTarget.value)}/>

        </div>
        <div className={"comment-send-btn-info-container flex justify-between items-center absolute left-0 bottom-0 w-full p-2 bg-gray-100 px-4"}>
            <div className={"comment-send-info-container flex items-center"}>
                <span className={"text-gray-500"}>{value.length}/1000</span>
            </div>
            <button className={"theme-bg text-white py-1 px-4 rounded-full cursor-pointer text-sm"}
                    onClick={sendComment}
            >发送</button>
        </div>
    </div>
}