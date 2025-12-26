/**
 * 구글 애널리틱스 GTM 처리 JS
 */

let gtmChannel = '';
let gtmParams = {};

const addGtmEventHandler = (params) => {
    gtmParams = params;
    window.dataLayer.push (gtmParams);

    return;
}

const setGtmParams = (gtmStep, step) => {
    console.log(`gtm : ${gtmStep}_${step}`);
    let gtmParams = {};
    gtmParams.event = `${gtmStep}_${gtmChannel}`;
    if(step) gtmParams.step = step;

    addGtmEventHandler(gtmParams);

    return;
}