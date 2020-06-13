import ApiConstants from "../../../themes/apiConstants";
// competition dashboard
function testCall() {
    const action = {
        type: ApiConstants.testApi,

    };
    return action;
}


function testCall2() {
    const action = {
        type: ApiConstants.testApi2,

    };
    return action;
}




export {
    testCall,
    testCall2

}
