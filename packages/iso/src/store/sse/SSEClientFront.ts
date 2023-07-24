export class SSEClientFront {

    public static getSSERoute = (meta: { storeGuid: string, userId: string }) => {
        console.log('Location : ' + window.location)
        return window.location.host + "/sse/user&" + new URLSearchParams(meta).toString()
    }
}
