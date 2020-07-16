import * as Bowser from "bowser";

export const Web3Utils ={
    isBrowserWeb3Capable: ()=>{
        //User Agent
        const browser= Bowser.getParser(window.navigator.userAgent)
        const userAgent= browser.parse().parsedResult;
        console.log("user agent")
        console.log(userAgent)

        const validBrowser = browser.satisfies({
            desktop: {
                chrome: ">49",
                firefox: ">52",
                opera: ">36"
            }
        }) ? true : false;
        return {validBrowser,userAgent};

    },

}
