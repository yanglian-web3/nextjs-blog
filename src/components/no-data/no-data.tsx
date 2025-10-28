import IconNoData from "../icons/icon-no-data";

export default function NoData() {

    return <div className={"no-data-container flex justify-center py-20"}>
        <div className={"flex-col items-center"}>
            <IconNoData width={120} height={120} color={"#6a7282"}/>
            <span className={"text-xl text-gray-500"}>这里空空如也~</span>
        </div>
    </div>
}