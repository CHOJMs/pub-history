/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info/
*
**/
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
},

urlSafeEncode : function (input)	{
	var b64 = Base64.encode(input);
	return b64.replace('+', '-').replace('/', '_').replace(/=+$/, '');
},

urlSafeDecode : function (input)	{
	var input = input.replace('-', '+').replace('_', '/');
	return Base64.decode(input);
}

}
/*
var b64map="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad="=";

function hex2b64(h) {
  var i;
  var c;
  var ret = "";
  for(i = 0; i+3 <= h.length; i+=3) {
    c = parseInt(h.substring(i,i+3),16);
    ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
  }
  if(i+1 == h.length) {
    c = parseInt(h.substring(i,i+1),16);
    ret += b64map.charAt(c << 2);
  }
  else if(i+2 == h.length) {
    c = parseInt(h.substring(i,i+2),16);
    ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
  }
  while((ret.length & 3) > 0) ret += b64pad;
  return ret;
}

// convert a base64 string to hex
function b64tohex(s) {
  var ret = "";
  var i;
  var k = 0; // b64 state, 0-3
  var slop=0;
  for(i = 0; i < s.length; ++i) {
    if(s.charAt(i) == b64pad) break;
    v = b64map.indexOf(s.charAt(i));
    if(v < 0) continue;
    if(k == 0) {
      ret += tk_int2char(v >> 2);
      slop = v & 3;
      k = 1;
    }
    else if(k == 1) {
      ret += tk_int2char((slop << 2) | (v >> 4));
      slop = v & 0xf;
      k = 2;
    }
    else if(k == 2) {
      ret += tk_int2char(slop);
      ret += tk_int2char(v >> 2);
      slop = v & 3;
      k = 3;
    }
    else {
      ret += tk_int2char((slop << 2) | (v >> 4));
      ret += tk_int2char(v & 0xf);
      k = 0;
    }
  }
  if(k == 1)
    ret += tk_int2char(slop << 2);
  return ret;
}

// convert a base64 string to a byte/number array
function b64toBA(s) {
  //piggyback on b64tohex for now, optimize later
  var h = b64tohex(s);
  var i;
  var a = new Array();
  for(i = 0; 2*i < h.length; ++i) {
    a[i] = parseInt(h.substring(2*i,2*i+2),16);
  }
  return a;
}

function char2Base64(s)
{
	 var  characters= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=" ;
     var result     = '';

     var i = 0;
     do {
         var a = s[i++];
         var b = s[i++];
         var c = s[i++];

         a = a ? a : 0;
         b = b ? b : 0;
         c = c ? c : 0;

         var b1 = ( a >> 2 ) & 0x3F;
         var b2 = ( ( a & 0x3 ) << 4 ) | ( ( b >> 4 ) & 0xF );
         var b3 = ( ( b & 0xF ) << 2 ) | ( ( c >> 6 ) & 0x3 );
         var b4 = c & 0x3F;

         if( ! b ) {
             b3 = b4 = 64;
         } else if( ! c ) {
             b4 = 64;
         }

         result += characters.charAt( b1 ) + characters.charAt( b2 ) + characters.charAt( b3 ) +characters.charAt( b4 );

     } while ( i < s.length );

     return result;
}

function decode64(input) {
   var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;
   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
   do {
	  enc1 = keyStr.indexOf(input.charAt(i++));
	  enc2 = keyStr.indexOf(input.charAt(i++));
	  enc3 = keyStr.indexOf(input.charAt(i++));
	  enc4 = keyStr.indexOf(input.charAt(i++));
	  chr1 = (enc1 << 2) | (enc2 >> 4);
	  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	  chr3 = ((enc3 & 3) << 6) | enc4;
	  output = output + String.fromCharCode(chr1);
	  if (enc3 != 64) {
		 output = output + String.fromCharCode(chr2);
	  }
	  if (enc4 != 64) {
		 output = output + String.fromCharCode(chr3);
	  }
   } while (i < input.length);
   return output;
}
function urlB64Encode(unencoded) {
	alert("unencoded:"+unencoded);
	var encoded = atob(unescape(encodeURIComponent(unencoded)));
	alert("encoded:"+encoded);
	return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};
function urlB64Encode2(unencoded) {
	alert("unencoded:"+unencoded);
	var encoded = char2Base64(unencoded);
	alert("encoded:"+encoded);
	return encoded.replace('+', '-').replace('/', '_').replace(/=+$/, '');
};

function urlB64Decode(encoded) {
	var encoded = encoded.replace('-', '+').replace('_', '/');
	while (encoded.length % 4)
		encoded += '=';
	return decode64(encoded);
};
function arrayBufferToBase64(arrayBuffer) {
	alert("arrayBuffer:"+arrayBuffer);
    var byteArray = new Uint8Array(arrayBuffer);
	alert("byteArray:"+byteArray);
    var byteString = '';
 	alert("len:"+byteArray.byteLength);
   for(var i=0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
	alert("byteString:"+byteString);
    }
    var b64 = window.btoa(byteString);
	alert(b64);

    return b64;
}

*/
function addNewLines(str) {
    var finalString = '';
    while(str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }
    return finalString;
}
function base64Url2PemCert(urlB64Cert)	{
    var b64 = addNewLines(urlB64Cert);
    var pem = "-----BEGIN CERTIFICATE-----\n" + b64 + "-----END CERTIFICATE-----";    
    return pem;
}
