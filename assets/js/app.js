
const btnGen = document.querySelector( '#js-generate' );
const btnClear = document.querySelector( '#js-clear' );
const fieldUrlList = document.querySelector( '#url-list' );
const fieldResult = document.querySelector( '#url-result' );

/**
 * (start) Demo data
 */
document.querySelector( '#js-demo' ).addEventListener( 'click', ( e ) => {
	const testDomain = 'https://example.test';
	const demoData = {
		utm_source: 'mailchimp',
		utm_medium: 'email',
		utm_campaign: 'spring_sale',
		utm_content: 'knopka-kupit',
		utm_term: 'buy+shoes',
		url_list: [
			'',
			'/',
			'index.html',
			'/index.html',
			testDomain + '',
			testDomain + '/',
			testDomain + '/?var=one',
			testDomain + '/?var=2&filter=1',
			testDomain + '/?var=3#anchor',
			testDomain + '/?utm_medium=cpc&var=4',
		],
	};
	document.querySelectorAll( '.request-field' ).forEach( ( el ) => {
		let name = el.getAttribute( 'name' );
		if ( name && Object.hasOwn( demoData, name ) ) {
			el.value = demoData[name];
		}
	} );
	document.querySelector( '#url-list' ).value = demoData.url_list.join( '\n' );
	btnGen.click();
});
// - (end) Demo data ---

btnClear.addEventListener( 'click', ( e ) => {
	e.preventDefault();
	document.querySelectorAll( '.request-field, #url-list, #url-result' ).forEach( ( el ) => {
		el.value = '';
	} );
} );

btnGen.addEventListener( 'click', ( e ) => {
	e.preventDefault();

	let urls = fieldUrlList?.value ?? '';
	let hasUTM = false;
	const fieldsList = document.querySelectorAll( '.request-field' );
	let result = null;
	let utmData = new Object();

	if ( fieldsList.length ) {
		for ( let itemField of fieldsList ) {
			let fieldName;
			if ( ( fieldName = itemField.getAttribute( 'name' ) ) && itemField.value ) {
				utmData[fieldName] = itemField.value;
				hasUTM = true;
			}
		}
	}

	if ( hasUTM ) {
		urls = urls.split( '\n' );
		result = [];
		for ( let itemUrl of urls ) {
			let itemHash = null,
				itemSearch = null;

			if ( itemUrl.split( '#' ).length > 1 ) {
				itemUrl = itemUrl.split( '#' );
				itemHash = itemUrl.pop();
				itemUrl = itemUrl[0];
			}

			if ( itemUrl.split( '?' ).length > 1 ) {
				itemUrl = itemUrl.split( '?' );
				itemSearch = new URLSearchParams( itemUrl.pop() );
				itemUrl = itemUrl[0];
			} else {
				itemSearch = new URLSearchParams();
			}

			if ( URL.canParse( itemUrl ) ) {
				itemUrl = new URL( itemUrl ).toString();
			}

			for ( let utmItem in utmData ) {
				if ( Object.hasOwn( utmData, utmItem ) ) {
					if ( itemSearch.has( utmItem ) ) {
						itemSearch.delete( utmItem );
					}
					itemSearch.set( utmItem, utmData[utmItem] );
				}
			}

			let searchSeparator = '?';
			if ( !itemUrl ) {
				searchSeparator = '';
			}

			result.push(
				itemUrl
				+ ( itemSearch.size ? searchSeparator + itemSearch.toString() : '' )
				+ ( itemHash ? '#' + itemHash : '' )
			);
		}
		result = result.join( '\n' );
	} else {
		result = urls;
	}

	if ( result && fieldResult ) {
		fieldResult.value = result;
	}
} );