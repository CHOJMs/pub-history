/**
 *  약관, 약정서 등의 text 파일을 비동기로 읽어, callback 함수의 인자로 넘겨준다
 * @author: 이종범
 * @version: 1.0
 */

/**
 * @callback fetchCallback
 * @param	{ string }					data - fetch 데이터
 * @returns { void }
 */

/**
 * @param { Object }				obj - 파일 URL 및 callback 함수
 * @param { string }					obj.url - 파일명
 * @param { fetchCallback }		obj.callback - fetch 후 실행할 callback 함수
 */
const asyncFetch = async (obj) => {
	const { url, callback } = obj;
	console.log('asyncFetch >> ' + url + ', ' + callback);
	await fetch(url, { cache: 'no-store' })
			.then(resp => resp.ok ? resp.text() : "")
			.then(data => callback(data))
			.catch(err => console.log('fetch error : ' + err));
};