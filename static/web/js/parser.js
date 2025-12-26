function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable */

/* global-module */
class OcrResultParser {
  constructor() {
    _defineProperty(this, "__ocrTypeList", ['idcard', 'driver', 'passport', 'foreign-passport', 'alien', 'credit', 'idcard-ssa', 'driver-ssa', 'passport-ssa', 'foreign-passport-ssa', 'alien-ssa', 'credit-ssa']);
  }
  parseOcrResult(ocrType, ssaMode, ocrResult, ssaResult, ssaRetryCount, ssaResultList) {
    if (!this.__ocrTypeList.includes(ocrType)) throw new Error('ResultParser :: Unsupported OCR type');
    var legacyFormat = {};
    var newFormat = {};

    // SSA 처리
    if (ssaMode && !!ssaResult) {
      this.__parseSsaResult(ssaResult, ssaRetryCount, ssaResultList, ocrResult, legacyFormat);
    }
    switch (ocrType) {
      case 'idcard':
      case 'driver':
      case 'idcard-ssa':
      case 'driver-ssa':
        this.__parseIdDriver(ocrResult, legacyFormat);
        break;
      case 'passport':
      case 'passport-ssa':
      case 'foreign-passport':
      case 'foreign-passport-ssa':
        this.__parsePassport(ocrResult, legacyFormat);
        break;
      case 'alien':
      case 'alien-ssa':
        this.__parseAlien(ocrResult, legacyFormat);
        break;
      case 'credit':
        [legacyFormat, ocrResult] = this.__parseCredit(ocrResult, legacyFormat);
        break;
      default:
        throw new Error('Unsupported OCR type');
    }
    return {
      legacyFormat,
      newFormat: ocrResult
    };
  }
  __parseSsaResult(ssaResult, ssaRetryCount, ssaResultList, ocrResult, legacyFormat) {
    var ssaResultObj = this.__csvToObject(ssaResult);
    [ocrResult.id_truth, ocrResult.fd_confidence] = [ssaResultObj.truth, ssaResultObj.conf];
    ocrResult.id_truth_retry_count = ssaRetryCount;
    if (ssaResultList && ssaRetryCount > 0) {
      var truthResultDetail = [];
      for (var item of ssaResultList) {
        var tmpObj = this.__csvToObject(item);
        var truthResult = {
          id_truth: tmpObj.truth,
          fd_confidence: tmpObj.conf
        };
        truthResultDetail.push(truthResult);
      }
      ocrResult.id_truth_result_detail = truthResultDetail;
    }
    var keyMapSsaResult = {
      truth: 'id_truth',
      truthConfidence: 'fd_confidence',
      truthRetryCount: 'id_truth_retry_count',
      truthResultDetail: 'id_truth_result_detail'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapSsaResult);
    if (ssaResultList && ssaRetryCount > 0) {
      var tmpResultDetail = [];
      for (var idx in legacyFormat.truthResultDetail) {
        var keyMapSsaResultDetail = {
          truth: 'id_truth',
          truthConfidence: 'fd_confidence'
        };
        var detailLegacyFormat = {};
        this.__convertLegacyFormat(legacyFormat.truthResultDetail[idx], detailLegacyFormat, keyMapSsaResultDetail);
        tmpResultDetail.push(detailLegacyFormat);
      }
      legacyFormat.truthResultDetail = tmpResultDetail;
    }
  }
  __csvToObject(str) {
    var pairs = str.split(';');
    var obj = {};
    for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split(':');
      if (pair.length === 2) obj[pair[0]] = pair[1];
    }
    return obj;
  }
  __convertLegacyFormat(obj, legacyFormat, map) {
    for (var key in map) {
      legacyFormat[key] = typeof obj[map[key]] === 'object' ? _objectSpread({}, obj[map[key]]) : obj[map[key]];
    }
    return legacyFormat;
  }
  __getObjectValueWithDot(obj, key) {
    if (obj) {
      if (key.split('.').length === 1) {
        return obj[key];
      }
      var tmpKey = key.split('.')[0];
      var tmpKey2 = key.slice(tmpKey.length + 1, key.length);
      return this.__getObjectValueWithDot(obj[tmpKey], tmpKey2);
    }
  }
  __parseIdDriver(ocrResult, legacyFormat) {
    // 주민번호 형식 리턴값 형식 변경
    // birth 추가
    if (ocrResult.jumin !== undefined && ocrResult.jumin.length >= 6) {
      ocrResult.birth = ocrResult.jumin.slice(0, 6);
    }
    if (ocrResult.jumin !== undefined && ocrResult.jumin.length === 13) {
      ocrResult.jumin = ocrResult.jumin.slice(0, 6) + '-' + ocrResult.jumin.slice(6, 13);
    } else {
      ocrResult.jumin = '';
    }
    if (ocrResult.idType === '2') {
      // 구형 면허증 포멧 판정 (ex: 제주 13-001234-12 -> true)
      var regex = /[가-힣]/g;
      ocrResult.is_old_format_driver_number = !!ocrResult.driver_number.match(regex);
      if (ocrResult.is_old_format_driver_number) {
        // useb api 포멧에 맞게 변경 (to: 제주-13-001234-12)
        ocrResult.driver_number = ocrResult.driver_number.replace(' ', '-');
      }
    }
    var keyMapIdDriver = {
      Completed: 'complete',
      type: 'result_scan_type',
      name: 'name',
      number: 'jumin',
      Date: 'issued_date',
      region: 'region',
      licenseNumber: 'driver_number',
      isOldFormatLicenseNumber: 'is_old_format_driver_number',
      serial: 'driver_serial',
      licenseType: 'driver_type',
      color_point: 'color_point',
      face_score: 'found_face',
      specular: 'specular_ratio',
      start_t: 'start_time',
      end_t: 'end_time',
      id_type: 'result_scan_type'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapIdDriver);
  }
  __parsePassport(ocrResult, legacyFormat) {
    // 주민번호 형식 리턴값 형식 변경
    if (ocrResult.jumin !== undefined && ocrResult.jumin.length === 13) {
      ocrResult.jumin = ocrResult.jumin.slice(0, 6) + '-' + ocrResult.jumin.slice(6, 13);
    } else {
      ocrResult.jumin = '';
    }
    var keyMapPassport = {
      Completed: 'complete',
      name: 'name',
      surName: 'sur_name',
      givenName: 'given_name',
      type: 'passport_type',
      issuing_country: 'issuing_country',
      passport_no: 'passport_number',
      nationality: 'nationality',
      date_of_issue: 'issued_date',
      sex: 'sex',
      date_of_expiry: 'expiry_date',
      personal_no: 'personal_number',
      number: 'jumin',
      date_of_birth: 'birthday',
      name_kor: 'name_kor',
      mrz1: 'mrz1',
      mrz2: 'mrz2',
      color_point: 'color_point',
      face_score: 'found_face',
      specular: 'specular_ratio',
      start_t: 'start_time',
      end_t: 'end_time',
      id_type: 'result_scan_type'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapPassport);
  }
  __parseAlien(ocrResult, legacyFormat) {
    // 주민번호 형식 리턴값 형식 변경
    if (ocrResult.jumin !== undefined && ocrResult.jumin.length === 13) {
      ocrResult.jumin = ocrResult.jumin.slice(0, 6) + '-' + ocrResult.jumin.slice(6, 13);
    } else {
      ocrResult.jumin = '';
    }
    var keyMapAlien = {
      Completed: 'complete',
      name: 'name',
      number: 'jumin',
      Date: 'issued_date',
      nationality: 'nationality',
      visaType: 'visa_type',
      name_kor: 'name_kor',
      color_point: 'color_point',
      face_score: 'found_face',
      specular: 'specular_ratio',
      start_t: 'start_time',
      end_t: 'end_time',
      id_type: 'result_scan_type'
    };
    this.__convertLegacyFormat(ocrResult, legacyFormat, keyMapAlien);
  }
  __parseCredit(ocrResult, legacyFormat) {
    var resultSplit = ocrResult.split(',');
    var resultIndex = 0;
    if (resultIndex < resultSplit.length) legacyFormat.Completed = resultSplit[resultIndex], resultIndex++;
    if (resultIndex < resultSplit.length) legacyFormat.number = resultSplit[resultIndex], resultIndex++;
    if (resultIndex < resultSplit.length) legacyFormat.exp_date = resultSplit[resultIndex], resultIndex++;
    return [legacyFormat, legacyFormat];
  }
}
export default new OcrResultParser();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy9wYXJzZXIuanMiLCJuYW1lcyI6WyJPY3JSZXN1bHRQYXJzZXIiLCJjb25zdHJ1Y3RvciIsIl9kZWZpbmVQcm9wZXJ0eSIsInBhcnNlT2NyUmVzdWx0Iiwib2NyVHlwZSIsInNzYU1vZGUiLCJvY3JSZXN1bHQiLCJzc2FSZXN1bHQiLCJzc2FSZXRyeUNvdW50Iiwic3NhUmVzdWx0TGlzdCIsIl9fb2NyVHlwZUxpc3QiLCJpbmNsdWRlcyIsIkVycm9yIiwibGVnYWN5Rm9ybWF0IiwibmV3Rm9ybWF0IiwiX19wYXJzZVNzYVJlc3VsdCIsIl9fcGFyc2VJZERyaXZlciIsIl9fcGFyc2VQYXNzcG9ydCIsIl9fcGFyc2VBbGllbiIsIl9fcGFyc2VDcmVkaXQiLCJzc2FSZXN1bHRPYmoiLCJfX2NzdlRvT2JqZWN0IiwiaWRfdHJ1dGgiLCJmZF9jb25maWRlbmNlIiwidHJ1dGgiLCJjb25mIiwiaWRfdHJ1dGhfcmV0cnlfY291bnQiLCJ0cnV0aFJlc3VsdERldGFpbCIsIml0ZW0iLCJ0bXBPYmoiLCJ0cnV0aFJlc3VsdCIsInB1c2giLCJpZF90cnV0aF9yZXN1bHRfZGV0YWlsIiwia2V5TWFwU3NhUmVzdWx0IiwidHJ1dGhDb25maWRlbmNlIiwidHJ1dGhSZXRyeUNvdW50IiwiX19jb252ZXJ0TGVnYWN5Rm9ybWF0IiwidG1wUmVzdWx0RGV0YWlsIiwiaWR4Iiwia2V5TWFwU3NhUmVzdWx0RGV0YWlsIiwiZGV0YWlsTGVnYWN5Rm9ybWF0Iiwic3RyIiwicGFpcnMiLCJzcGxpdCIsIm9iaiIsImkiLCJsZW5ndGgiLCJwYWlyIiwibWFwIiwia2V5IiwiX29iamVjdFNwcmVhZCIsIl9fZ2V0T2JqZWN0VmFsdWVXaXRoRG90IiwidG1wS2V5IiwidG1wS2V5MiIsInNsaWNlIiwianVtaW4iLCJ1bmRlZmluZWQiLCJiaXJ0aCIsImlkVHlwZSIsInJlZ2V4IiwiaXNfb2xkX2Zvcm1hdF9kcml2ZXJfbnVtYmVyIiwiZHJpdmVyX251bWJlciIsIm1hdGNoIiwicmVwbGFjZSIsImtleU1hcElkRHJpdmVyIiwiQ29tcGxldGVkIiwidHlwZSIsIm5hbWUiLCJudW1iZXIiLCJEYXRlIiwicmVnaW9uIiwibGljZW5zZU51bWJlciIsImlzT2xkRm9ybWF0TGljZW5zZU51bWJlciIsInNlcmlhbCIsImxpY2Vuc2VUeXBlIiwiY29sb3JfcG9pbnQiLCJmYWNlX3Njb3JlIiwic3BlY3VsYXIiLCJzdGFydF90IiwiZW5kX3QiLCJpZF90eXBlIiwia2V5TWFwUGFzc3BvcnQiLCJzdXJOYW1lIiwiZ2l2ZW5OYW1lIiwiaXNzdWluZ19jb3VudHJ5IiwicGFzc3BvcnRfbm8iLCJuYXRpb25hbGl0eSIsImRhdGVfb2ZfaXNzdWUiLCJzZXgiLCJkYXRlX29mX2V4cGlyeSIsInBlcnNvbmFsX25vIiwiZGF0ZV9vZl9iaXJ0aCIsIm5hbWVfa29yIiwibXJ6MSIsIm1yejIiLCJrZXlNYXBBbGllbiIsInZpc2FUeXBlIiwicmVzdWx0U3BsaXQiLCJyZXN1bHRJbmRleCIsImV4cF9kYXRlIl0sInNvdXJjZXMiOlsiaGVscGVycy9wYXJzZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cblxuLyogZ2xvYmFsLW1vZHVsZSAqL1xuY2xhc3MgT2NyUmVzdWx0UGFyc2VyIHtcbiAgX19vY3JUeXBlTGlzdCA9IFsnaWRjYXJkJywgJ2RyaXZlcicsICdwYXNzcG9ydCcsICdmb3JlaWduLXBhc3Nwb3J0JywgJ2FsaWVuJywgJ2NyZWRpdCcsICdpZGNhcmQtc3NhJywgJ2RyaXZlci1zc2EnLCAncGFzc3BvcnQtc3NhJywgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJywgJ2FsaWVuLXNzYScsICdjcmVkaXQtc3NhJ107XG4gIHBhcnNlT2NyUmVzdWx0KG9jclR5cGUsIHNzYU1vZGUsIG9jclJlc3VsdCwgc3NhUmVzdWx0LCBzc2FSZXRyeUNvdW50LCBzc2FSZXN1bHRMaXN0KSB7XG4gICAgaWYgKCF0aGlzLl9fb2NyVHlwZUxpc3QuaW5jbHVkZXMob2NyVHlwZSkpIHRocm93IG5ldyBFcnJvcignUmVzdWx0UGFyc2VyIDo6IFVuc3VwcG9ydGVkIE9DUiB0eXBlJyk7XG4gICAgbGV0IGxlZ2FjeUZvcm1hdCA9IHt9O1xuICAgIGxldCBuZXdGb3JtYXQgPSB7fTtcblxuICAgIC8vIFNTQSDsspjrpqxcbiAgICBpZiAoc3NhTW9kZSAmJiAhIXNzYVJlc3VsdCkge1xuICAgICAgdGhpcy5fX3BhcnNlU3NhUmVzdWx0KHNzYVJlc3VsdCwgc3NhUmV0cnlDb3VudCwgc3NhUmVzdWx0TGlzdCwgb2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQpO1xuICAgIH1cbiAgICBzd2l0Y2ggKG9jclR5cGUpIHtcbiAgICAgIGNhc2UgJ2lkY2FyZCc6XG4gICAgICBjYXNlICdkcml2ZXInOlxuICAgICAgY2FzZSAnaWRjYXJkLXNzYSc6XG4gICAgICBjYXNlICdkcml2ZXItc3NhJzpcbiAgICAgICAgdGhpcy5fX3BhcnNlSWREcml2ZXIob2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3Bhc3Nwb3J0JzpcbiAgICAgIGNhc2UgJ3Bhc3Nwb3J0LXNzYSc6XG4gICAgICBjYXNlICdmb3JlaWduLXBhc3Nwb3J0JzpcbiAgICAgIGNhc2UgJ2ZvcmVpZ24tcGFzc3BvcnQtc3NhJzpcbiAgICAgICAgdGhpcy5fX3BhcnNlUGFzc3BvcnQob2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ2FsaWVuJzpcbiAgICAgIGNhc2UgJ2FsaWVuLXNzYSc6XG4gICAgICAgIHRoaXMuX19wYXJzZUFsaWVuKG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICdjcmVkaXQnOlxuICAgICAgICBbbGVnYWN5Rm9ybWF0LCBvY3JSZXN1bHRdID0gdGhpcy5fX3BhcnNlQ3JlZGl0KG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIE9DUiB0eXBlJyk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBsZWdhY3lGb3JtYXQsXG4gICAgICBuZXdGb3JtYXQ6IG9jclJlc3VsdFxuICAgIH07XG4gIH1cbiAgX19wYXJzZVNzYVJlc3VsdChzc2FSZXN1bHQsIHNzYVJldHJ5Q291bnQsIHNzYVJlc3VsdExpc3QsIG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0KSB7XG4gICAgY29uc3Qgc3NhUmVzdWx0T2JqID0gdGhpcy5fX2NzdlRvT2JqZWN0KHNzYVJlc3VsdCk7XG4gICAgW29jclJlc3VsdC5pZF90cnV0aCwgb2NyUmVzdWx0LmZkX2NvbmZpZGVuY2VdID0gW3NzYVJlc3VsdE9iai50cnV0aCwgc3NhUmVzdWx0T2JqLmNvbmZdO1xuICAgIG9jclJlc3VsdC5pZF90cnV0aF9yZXRyeV9jb3VudCA9IHNzYVJldHJ5Q291bnQ7XG4gICAgaWYgKHNzYVJlc3VsdExpc3QgJiYgc3NhUmV0cnlDb3VudCA+IDApIHtcbiAgICAgIGxldCB0cnV0aFJlc3VsdERldGFpbCA9IFtdO1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIHNzYVJlc3VsdExpc3QpIHtcbiAgICAgICAgY29uc3QgdG1wT2JqID0gdGhpcy5fX2NzdlRvT2JqZWN0KGl0ZW0pO1xuICAgICAgICBjb25zdCB0cnV0aFJlc3VsdCA9IHtcbiAgICAgICAgICBpZF90cnV0aDogdG1wT2JqLnRydXRoLFxuICAgICAgICAgIGZkX2NvbmZpZGVuY2U6IHRtcE9iai5jb25mXG4gICAgICAgIH07XG4gICAgICAgIHRydXRoUmVzdWx0RGV0YWlsLnB1c2godHJ1dGhSZXN1bHQpO1xuICAgICAgfVxuICAgICAgb2NyUmVzdWx0LmlkX3RydXRoX3Jlc3VsdF9kZXRhaWwgPSB0cnV0aFJlc3VsdERldGFpbDtcbiAgICB9XG4gICAgY29uc3Qga2V5TWFwU3NhUmVzdWx0ID0ge1xuICAgICAgdHJ1dGg6ICdpZF90cnV0aCcsXG4gICAgICB0cnV0aENvbmZpZGVuY2U6ICdmZF9jb25maWRlbmNlJyxcbiAgICAgIHRydXRoUmV0cnlDb3VudDogJ2lkX3RydXRoX3JldHJ5X2NvdW50JyxcbiAgICAgIHRydXRoUmVzdWx0RGV0YWlsOiAnaWRfdHJ1dGhfcmVzdWx0X2RldGFpbCdcbiAgICB9O1xuICAgIHRoaXMuX19jb252ZXJ0TGVnYWN5Rm9ybWF0KG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0LCBrZXlNYXBTc2FSZXN1bHQpO1xuICAgIGlmIChzc2FSZXN1bHRMaXN0ICYmIHNzYVJldHJ5Q291bnQgPiAwKSB7XG4gICAgICBjb25zdCB0bXBSZXN1bHREZXRhaWwgPSBbXTtcbiAgICAgIGZvciAoY29uc3QgaWR4IGluIGxlZ2FjeUZvcm1hdC50cnV0aFJlc3VsdERldGFpbCkge1xuICAgICAgICBjb25zdCBrZXlNYXBTc2FSZXN1bHREZXRhaWwgPSB7XG4gICAgICAgICAgdHJ1dGg6ICdpZF90cnV0aCcsXG4gICAgICAgICAgdHJ1dGhDb25maWRlbmNlOiAnZmRfY29uZmlkZW5jZSdcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZGV0YWlsTGVnYWN5Rm9ybWF0ID0ge307XG4gICAgICAgIHRoaXMuX19jb252ZXJ0TGVnYWN5Rm9ybWF0KGxlZ2FjeUZvcm1hdC50cnV0aFJlc3VsdERldGFpbFtpZHhdLCBkZXRhaWxMZWdhY3lGb3JtYXQsIGtleU1hcFNzYVJlc3VsdERldGFpbCk7XG4gICAgICAgIHRtcFJlc3VsdERldGFpbC5wdXNoKGRldGFpbExlZ2FjeUZvcm1hdCk7XG4gICAgICB9XG4gICAgICBsZWdhY3lGb3JtYXQudHJ1dGhSZXN1bHREZXRhaWwgPSB0bXBSZXN1bHREZXRhaWw7XG4gICAgfVxuICB9XG4gIF9fY3N2VG9PYmplY3Qoc3RyKSB7XG4gICAgbGV0IHBhaXJzID0gc3RyLnNwbGl0KCc7Jyk7XG4gICAgbGV0IG9iaiA9IHt9O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBwYWlyID0gcGFpcnNbaV0uc3BsaXQoJzonKTtcbiAgICAgIGlmIChwYWlyLmxlbmd0aCA9PT0gMikgb2JqW3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICB9XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuICBfX2NvbnZlcnRMZWdhY3lGb3JtYXQob2JqLCBsZWdhY3lGb3JtYXQsIG1hcCkge1xuICAgIGZvciAoY29uc3Qga2V5IGluIG1hcCkge1xuICAgICAgbGVnYWN5Rm9ybWF0W2tleV0gPSB0eXBlb2Ygb2JqW21hcFtrZXldXSA9PT0gJ29iamVjdCcgPyB7XG4gICAgICAgIC4uLm9ialttYXBba2V5XV1cbiAgICAgIH0gOiBvYmpbbWFwW2tleV1dO1xuICAgIH1cbiAgICByZXR1cm4gbGVnYWN5Rm9ybWF0O1xuICB9XG4gIF9fZ2V0T2JqZWN0VmFsdWVXaXRoRG90KG9iaiwga2V5KSB7XG4gICAgaWYgKG9iaikge1xuICAgICAgaWYgKGtleS5zcGxpdCgnLicpLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gb2JqW2tleV07XG4gICAgICB9XG4gICAgICBjb25zdCB0bXBLZXkgPSBrZXkuc3BsaXQoJy4nKVswXTtcbiAgICAgIGNvbnN0IHRtcEtleTIgPSBrZXkuc2xpY2UodG1wS2V5Lmxlbmd0aCArIDEsIGtleS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHRoaXMuX19nZXRPYmplY3RWYWx1ZVdpdGhEb3Qob2JqW3RtcEtleV0sIHRtcEtleTIpO1xuICAgIH1cbiAgfVxuICBfX3BhcnNlSWREcml2ZXIob2NyUmVzdWx0LCBsZWdhY3lGb3JtYXQpIHtcbiAgICAvLyDso7zrr7zrsojtmLgg7ZiV7IudIOumrO2EtOqwkiDtmJXsi50g67OA6rK9XG4gICAgLy8gYmlydGgg7LaU6rCAXG4gICAgaWYgKG9jclJlc3VsdC5qdW1pbiAhPT0gdW5kZWZpbmVkICYmIG9jclJlc3VsdC5qdW1pbi5sZW5ndGggPj0gNikge1xuICAgICAgb2NyUmVzdWx0LmJpcnRoID0gb2NyUmVzdWx0Lmp1bWluLnNsaWNlKDAsIDYpO1xuICAgIH1cbiAgICBpZiAob2NyUmVzdWx0Lmp1bWluICE9PSB1bmRlZmluZWQgJiYgb2NyUmVzdWx0Lmp1bWluLmxlbmd0aCA9PT0gMTMpIHtcbiAgICAgIG9jclJlc3VsdC5qdW1pbiA9IG9jclJlc3VsdC5qdW1pbi5zbGljZSgwLCA2KSArICctJyArIG9jclJlc3VsdC5qdW1pbi5zbGljZSg2LCAxMyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9jclJlc3VsdC5qdW1pbiA9ICcnO1xuICAgIH1cbiAgICBpZiAob2NyUmVzdWx0LmlkVHlwZSA9PT0gJzInKSB7XG4gICAgICAvLyDqtaztmJUg66m07ZeI7KadIO2PrOuppyDtjJDsoJUgKGV4OiDsoJzso7wgMTMtMDAxMjM0LTEyIC0+IHRydWUpXG4gICAgICBjb25zdCByZWdleCA9IC9b6rCALe2eo10vZztcbiAgICAgIG9jclJlc3VsdC5pc19vbGRfZm9ybWF0X2RyaXZlcl9udW1iZXIgPSAhIW9jclJlc3VsdC5kcml2ZXJfbnVtYmVyLm1hdGNoKHJlZ2V4KTtcbiAgICAgIGlmIChvY3JSZXN1bHQuaXNfb2xkX2Zvcm1hdF9kcml2ZXJfbnVtYmVyKSB7XG4gICAgICAgIC8vIHVzZWIgYXBpIO2PrOupp+yXkCDrp57qsowg67OA6rK9ICh0bzog7KCc7KO8LTEzLTAwMTIzNC0xMilcbiAgICAgICAgb2NyUmVzdWx0LmRyaXZlcl9udW1iZXIgPSBvY3JSZXN1bHQuZHJpdmVyX251bWJlci5yZXBsYWNlKCcgJywgJy0nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qga2V5TWFwSWREcml2ZXIgPSB7XG4gICAgICBDb21wbGV0ZWQ6ICdjb21wbGV0ZScsXG4gICAgICB0eXBlOiAncmVzdWx0X3NjYW5fdHlwZScsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBudW1iZXI6ICdqdW1pbicsXG4gICAgICBEYXRlOiAnaXNzdWVkX2RhdGUnLFxuICAgICAgcmVnaW9uOiAncmVnaW9uJyxcbiAgICAgIGxpY2Vuc2VOdW1iZXI6ICdkcml2ZXJfbnVtYmVyJyxcbiAgICAgIGlzT2xkRm9ybWF0TGljZW5zZU51bWJlcjogJ2lzX29sZF9mb3JtYXRfZHJpdmVyX251bWJlcicsXG4gICAgICBzZXJpYWw6ICdkcml2ZXJfc2VyaWFsJyxcbiAgICAgIGxpY2Vuc2VUeXBlOiAnZHJpdmVyX3R5cGUnLFxuICAgICAgY29sb3JfcG9pbnQ6ICdjb2xvcl9wb2ludCcsXG4gICAgICBmYWNlX3Njb3JlOiAnZm91bmRfZmFjZScsXG4gICAgICBzcGVjdWxhcjogJ3NwZWN1bGFyX3JhdGlvJyxcbiAgICAgIHN0YXJ0X3Q6ICdzdGFydF90aW1lJyxcbiAgICAgIGVuZF90OiAnZW5kX3RpbWUnLFxuICAgICAgaWRfdHlwZTogJ3Jlc3VsdF9zY2FuX3R5cGUnXG4gICAgfTtcbiAgICB0aGlzLl9fY29udmVydExlZ2FjeUZvcm1hdChvY3JSZXN1bHQsIGxlZ2FjeUZvcm1hdCwga2V5TWFwSWREcml2ZXIpO1xuICB9XG4gIF9fcGFyc2VQYXNzcG9ydChvY3JSZXN1bHQsIGxlZ2FjeUZvcm1hdCkge1xuICAgIC8vIOyjvOuvvOuyiO2YuCDtmJXsi50g66as7YS06rCSIO2YleyLnSDrs4Dqsr1cbiAgICBpZiAob2NyUmVzdWx0Lmp1bWluICE9PSB1bmRlZmluZWQgJiYgb2NyUmVzdWx0Lmp1bWluLmxlbmd0aCA9PT0gMTMpIHtcbiAgICAgIG9jclJlc3VsdC5qdW1pbiA9IG9jclJlc3VsdC5qdW1pbi5zbGljZSgwLCA2KSArICctJyArIG9jclJlc3VsdC5qdW1pbi5zbGljZSg2LCAxMyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9jclJlc3VsdC5qdW1pbiA9ICcnO1xuICAgIH1cbiAgICBjb25zdCBrZXlNYXBQYXNzcG9ydCA9IHtcbiAgICAgIENvbXBsZXRlZDogJ2NvbXBsZXRlJyxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIHN1ck5hbWU6ICdzdXJfbmFtZScsXG4gICAgICBnaXZlbk5hbWU6ICdnaXZlbl9uYW1lJyxcbiAgICAgIHR5cGU6ICdwYXNzcG9ydF90eXBlJyxcbiAgICAgIGlzc3VpbmdfY291bnRyeTogJ2lzc3VpbmdfY291bnRyeScsXG4gICAgICBwYXNzcG9ydF9ubzogJ3Bhc3Nwb3J0X251bWJlcicsXG4gICAgICBuYXRpb25hbGl0eTogJ25hdGlvbmFsaXR5JyxcbiAgICAgIGRhdGVfb2ZfaXNzdWU6ICdpc3N1ZWRfZGF0ZScsXG4gICAgICBzZXg6ICdzZXgnLFxuICAgICAgZGF0ZV9vZl9leHBpcnk6ICdleHBpcnlfZGF0ZScsXG4gICAgICBwZXJzb25hbF9ubzogJ3BlcnNvbmFsX251bWJlcicsXG4gICAgICBudW1iZXI6ICdqdW1pbicsXG4gICAgICBkYXRlX29mX2JpcnRoOiAnYmlydGhkYXknLFxuICAgICAgbmFtZV9rb3I6ICduYW1lX2tvcicsXG4gICAgICBtcnoxOiAnbXJ6MScsXG4gICAgICBtcnoyOiAnbXJ6MicsXG4gICAgICBjb2xvcl9wb2ludDogJ2NvbG9yX3BvaW50JyxcbiAgICAgIGZhY2Vfc2NvcmU6ICdmb3VuZF9mYWNlJyxcbiAgICAgIHNwZWN1bGFyOiAnc3BlY3VsYXJfcmF0aW8nLFxuICAgICAgc3RhcnRfdDogJ3N0YXJ0X3RpbWUnLFxuICAgICAgZW5kX3Q6ICdlbmRfdGltZScsXG4gICAgICBpZF90eXBlOiAncmVzdWx0X3NjYW5fdHlwZSdcbiAgICB9O1xuICAgIHRoaXMuX19jb252ZXJ0TGVnYWN5Rm9ybWF0KG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0LCBrZXlNYXBQYXNzcG9ydCk7XG4gIH1cbiAgX19wYXJzZUFsaWVuKG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0KSB7XG4gICAgLy8g7KO866+867KI7Zi4IO2YleyLnSDrpqzthLTqsJIg7ZiV7IudIOuzgOqyvVxuICAgIGlmIChvY3JSZXN1bHQuanVtaW4gIT09IHVuZGVmaW5lZCAmJiBvY3JSZXN1bHQuanVtaW4ubGVuZ3RoID09PSAxMykge1xuICAgICAgb2NyUmVzdWx0Lmp1bWluID0gb2NyUmVzdWx0Lmp1bWluLnNsaWNlKDAsIDYpICsgJy0nICsgb2NyUmVzdWx0Lmp1bWluLnNsaWNlKDYsIDEzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2NyUmVzdWx0Lmp1bWluID0gJyc7XG4gICAgfVxuICAgIGNvbnN0IGtleU1hcEFsaWVuID0ge1xuICAgICAgQ29tcGxldGVkOiAnY29tcGxldGUnLFxuICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgbnVtYmVyOiAnanVtaW4nLFxuICAgICAgRGF0ZTogJ2lzc3VlZF9kYXRlJyxcbiAgICAgIG5hdGlvbmFsaXR5OiAnbmF0aW9uYWxpdHknLFxuICAgICAgdmlzYVR5cGU6ICd2aXNhX3R5cGUnLFxuICAgICAgbmFtZV9rb3I6ICduYW1lX2tvcicsXG4gICAgICBjb2xvcl9wb2ludDogJ2NvbG9yX3BvaW50JyxcbiAgICAgIGZhY2Vfc2NvcmU6ICdmb3VuZF9mYWNlJyxcbiAgICAgIHNwZWN1bGFyOiAnc3BlY3VsYXJfcmF0aW8nLFxuICAgICAgc3RhcnRfdDogJ3N0YXJ0X3RpbWUnLFxuICAgICAgZW5kX3Q6ICdlbmRfdGltZScsXG4gICAgICBpZF90eXBlOiAncmVzdWx0X3NjYW5fdHlwZSdcbiAgICB9O1xuICAgIHRoaXMuX19jb252ZXJ0TGVnYWN5Rm9ybWF0KG9jclJlc3VsdCwgbGVnYWN5Rm9ybWF0LCBrZXlNYXBBbGllbik7XG4gIH1cbiAgX19wYXJzZUNyZWRpdChvY3JSZXN1bHQsIGxlZ2FjeUZvcm1hdCkge1xuICAgIGNvbnN0IHJlc3VsdFNwbGl0ID0gb2NyUmVzdWx0LnNwbGl0KCcsJyk7XG4gICAgbGV0IHJlc3VsdEluZGV4ID0gMDtcbiAgICBpZiAocmVzdWx0SW5kZXggPCByZXN1bHRTcGxpdC5sZW5ndGgpIGxlZ2FjeUZvcm1hdC5Db21wbGV0ZWQgPSByZXN1bHRTcGxpdFtyZXN1bHRJbmRleF0sIHJlc3VsdEluZGV4Kys7XG4gICAgaWYgKHJlc3VsdEluZGV4IDwgcmVzdWx0U3BsaXQubGVuZ3RoKSBsZWdhY3lGb3JtYXQubnVtYmVyID0gcmVzdWx0U3BsaXRbcmVzdWx0SW5kZXhdLCByZXN1bHRJbmRleCsrO1xuICAgIGlmIChyZXN1bHRJbmRleCA8IHJlc3VsdFNwbGl0Lmxlbmd0aCkgbGVnYWN5Rm9ybWF0LmV4cF9kYXRlID0gcmVzdWx0U3BsaXRbcmVzdWx0SW5kZXhdLCByZXN1bHRJbmRleCsrO1xuICAgIHJldHVybiBbbGVnYWN5Rm9ybWF0LCBsZWdhY3lGb3JtYXRdO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBuZXcgT2NyUmVzdWx0UGFyc2VyKCk7Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBOztBQUVBO0FBQ0EsTUFBTUEsZUFBZSxDQUFDO0VBQUFDLFlBQUE7SUFBQUMsZUFBQSx3QkFDSixDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsc0JBQXNCLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQztFQUFBO0VBQ3RMQyxjQUFjQSxDQUFDQyxPQUFPLEVBQUVDLE9BQU8sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUVDLGFBQWEsRUFBRUMsYUFBYSxFQUFFO0lBQ25GLElBQUksQ0FBQyxJQUFJLENBQUNDLGFBQWEsQ0FBQ0MsUUFBUSxDQUFDUCxPQUFPLENBQUMsRUFBRSxNQUFNLElBQUlRLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQztJQUNsRyxJQUFJQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUlDLFNBQVMsR0FBRyxDQUFDLENBQUM7O0lBRWxCO0lBQ0EsSUFBSVQsT0FBTyxJQUFJLENBQUMsQ0FBQ0UsU0FBUyxFQUFFO01BQzFCLElBQUksQ0FBQ1EsZ0JBQWdCLENBQUNSLFNBQVMsRUFBRUMsYUFBYSxFQUFFQyxhQUFhLEVBQUVILFNBQVMsRUFBRU8sWUFBWSxDQUFDO0lBQ3pGO0lBQ0EsUUFBUVQsT0FBTztNQUNiLEtBQUssUUFBUTtNQUNiLEtBQUssUUFBUTtNQUNiLEtBQUssWUFBWTtNQUNqQixLQUFLLFlBQVk7UUFDZixJQUFJLENBQUNZLGVBQWUsQ0FBQ1YsU0FBUyxFQUFFTyxZQUFZLENBQUM7UUFDN0M7TUFDRixLQUFLLFVBQVU7TUFDZixLQUFLLGNBQWM7TUFDbkIsS0FBSyxrQkFBa0I7TUFDdkIsS0FBSyxzQkFBc0I7UUFDekIsSUFBSSxDQUFDSSxlQUFlLENBQUNYLFNBQVMsRUFBRU8sWUFBWSxDQUFDO1FBQzdDO01BQ0YsS0FBSyxPQUFPO01BQ1osS0FBSyxXQUFXO1FBQ2QsSUFBSSxDQUFDSyxZQUFZLENBQUNaLFNBQVMsRUFBRU8sWUFBWSxDQUFDO1FBQzFDO01BQ0YsS0FBSyxRQUFRO1FBQ1gsQ0FBQ0EsWUFBWSxFQUFFUCxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUNhLGFBQWEsQ0FBQ2IsU0FBUyxFQUFFTyxZQUFZLENBQUM7UUFDdkU7TUFDRjtRQUNFLE1BQU0sSUFBSUQsS0FBSyxDQUFDLHNCQUFzQixDQUFDO0lBQUM7SUFFNUMsT0FBTztNQUNMQyxZQUFZO01BQ1pDLFNBQVMsRUFBRVI7SUFDYixDQUFDO0VBQ0g7RUFDQVMsZ0JBQWdCQSxDQUFDUixTQUFTLEVBQUVDLGFBQWEsRUFBRUMsYUFBYSxFQUFFSCxTQUFTLEVBQUVPLFlBQVksRUFBRTtJQUNqRixJQUFNTyxZQUFZLEdBQUcsSUFBSSxDQUFDQyxhQUFhLENBQUNkLFNBQVMsQ0FBQztJQUNsRCxDQUFDRCxTQUFTLENBQUNnQixRQUFRLEVBQUVoQixTQUFTLENBQUNpQixhQUFhLENBQUMsR0FBRyxDQUFDSCxZQUFZLENBQUNJLEtBQUssRUFBRUosWUFBWSxDQUFDSyxJQUFJLENBQUM7SUFDdkZuQixTQUFTLENBQUNvQixvQkFBb0IsR0FBR2xCLGFBQWE7SUFDOUMsSUFBSUMsYUFBYSxJQUFJRCxhQUFhLEdBQUcsQ0FBQyxFQUFFO01BQ3RDLElBQUltQixpQkFBaUIsR0FBRyxFQUFFO01BQzFCLEtBQUssSUFBTUMsSUFBSSxJQUFJbkIsYUFBYSxFQUFFO1FBQ2hDLElBQU1vQixNQUFNLEdBQUcsSUFBSSxDQUFDUixhQUFhLENBQUNPLElBQUksQ0FBQztRQUN2QyxJQUFNRSxXQUFXLEdBQUc7VUFDbEJSLFFBQVEsRUFBRU8sTUFBTSxDQUFDTCxLQUFLO1VBQ3RCRCxhQUFhLEVBQUVNLE1BQU0sQ0FBQ0o7UUFDeEIsQ0FBQztRQUNERSxpQkFBaUIsQ0FBQ0ksSUFBSSxDQUFDRCxXQUFXLENBQUM7TUFDckM7TUFDQXhCLFNBQVMsQ0FBQzBCLHNCQUFzQixHQUFHTCxpQkFBaUI7SUFDdEQ7SUFDQSxJQUFNTSxlQUFlLEdBQUc7TUFDdEJULEtBQUssRUFBRSxVQUFVO01BQ2pCVSxlQUFlLEVBQUUsZUFBZTtNQUNoQ0MsZUFBZSxFQUFFLHNCQUFzQjtNQUN2Q1IsaUJBQWlCLEVBQUU7SUFDckIsQ0FBQztJQUNELElBQUksQ0FBQ1MscUJBQXFCLENBQUM5QixTQUFTLEVBQUVPLFlBQVksRUFBRW9CLGVBQWUsQ0FBQztJQUNwRSxJQUFJeEIsYUFBYSxJQUFJRCxhQUFhLEdBQUcsQ0FBQyxFQUFFO01BQ3RDLElBQU02QixlQUFlLEdBQUcsRUFBRTtNQUMxQixLQUFLLElBQU1DLEdBQUcsSUFBSXpCLFlBQVksQ0FBQ2MsaUJBQWlCLEVBQUU7UUFDaEQsSUFBTVkscUJBQXFCLEdBQUc7VUFDNUJmLEtBQUssRUFBRSxVQUFVO1VBQ2pCVSxlQUFlLEVBQUU7UUFDbkIsQ0FBQztRQUNELElBQU1NLGtCQUFrQixHQUFHLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUNKLHFCQUFxQixDQUFDdkIsWUFBWSxDQUFDYyxpQkFBaUIsQ0FBQ1csR0FBRyxDQUFDLEVBQUVFLGtCQUFrQixFQUFFRCxxQkFBcUIsQ0FBQztRQUMxR0YsZUFBZSxDQUFDTixJQUFJLENBQUNTLGtCQUFrQixDQUFDO01BQzFDO01BQ0EzQixZQUFZLENBQUNjLGlCQUFpQixHQUFHVSxlQUFlO0lBQ2xEO0VBQ0Y7RUFDQWhCLGFBQWFBLENBQUNvQixHQUFHLEVBQUU7SUFDakIsSUFBSUMsS0FBSyxHQUFHRCxHQUFHLENBQUNFLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDMUIsSUFBSUMsR0FBRyxHQUFHLENBQUMsQ0FBQztJQUNaLEtBQUssSUFBSUMsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHSCxLQUFLLENBQUNJLE1BQU0sRUFBRUQsQ0FBQyxFQUFFLEVBQUU7TUFDckMsSUFBSUUsSUFBSSxHQUFHTCxLQUFLLENBQUNHLENBQUMsQ0FBQyxDQUFDRixLQUFLLENBQUMsR0FBRyxDQUFDO01BQzlCLElBQUlJLElBQUksQ0FBQ0QsTUFBTSxLQUFLLENBQUMsRUFBRUYsR0FBRyxDQUFDRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBR0EsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUMvQztJQUNBLE9BQU9ILEdBQUc7RUFDWjtFQUNBUixxQkFBcUJBLENBQUNRLEdBQUcsRUFBRS9CLFlBQVksRUFBRW1DLEdBQUcsRUFBRTtJQUM1QyxLQUFLLElBQU1DLEdBQUcsSUFBSUQsR0FBRyxFQUFFO01BQ3JCbkMsWUFBWSxDQUFDb0MsR0FBRyxDQUFDLEdBQUcsT0FBT0wsR0FBRyxDQUFDSSxHQUFHLENBQUNDLEdBQUcsQ0FBQyxDQUFDLEtBQUssUUFBUSxHQUFBQyxhQUFBLEtBQ2hETixHQUFHLENBQUNJLEdBQUcsQ0FBQ0MsR0FBRyxDQUFDLENBQUMsSUFDZEwsR0FBRyxDQUFDSSxHQUFHLENBQUNDLEdBQUcsQ0FBQyxDQUFDO0lBQ25CO0lBQ0EsT0FBT3BDLFlBQVk7RUFDckI7RUFDQXNDLHVCQUF1QkEsQ0FBQ1AsR0FBRyxFQUFFSyxHQUFHLEVBQUU7SUFDaEMsSUFBSUwsR0FBRyxFQUFFO01BQ1AsSUFBSUssR0FBRyxDQUFDTixLQUFLLENBQUMsR0FBRyxDQUFDLENBQUNHLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDL0IsT0FBT0YsR0FBRyxDQUFDSyxHQUFHLENBQUM7TUFDakI7TUFDQSxJQUFNRyxNQUFNLEdBQUdILEdBQUcsQ0FBQ04sS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNoQyxJQUFNVSxPQUFPLEdBQUdKLEdBQUcsQ0FBQ0ssS0FBSyxDQUFDRixNQUFNLENBQUNOLE1BQU0sR0FBRyxDQUFDLEVBQUVHLEdBQUcsQ0FBQ0gsTUFBTSxDQUFDO01BQ3hELE9BQU8sSUFBSSxDQUFDSyx1QkFBdUIsQ0FBQ1AsR0FBRyxDQUFDUSxNQUFNLENBQUMsRUFBRUMsT0FBTyxDQUFDO0lBQzNEO0VBQ0Y7RUFDQXJDLGVBQWVBLENBQUNWLFNBQVMsRUFBRU8sWUFBWSxFQUFFO0lBQ3ZDO0lBQ0E7SUFDQSxJQUFJUCxTQUFTLENBQUNpRCxLQUFLLEtBQUtDLFNBQVMsSUFBSWxELFNBQVMsQ0FBQ2lELEtBQUssQ0FBQ1QsTUFBTSxJQUFJLENBQUMsRUFBRTtNQUNoRXhDLFNBQVMsQ0FBQ21ELEtBQUssR0FBR25ELFNBQVMsQ0FBQ2lELEtBQUssQ0FBQ0QsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDL0M7SUFDQSxJQUFJaEQsU0FBUyxDQUFDaUQsS0FBSyxLQUFLQyxTQUFTLElBQUlsRCxTQUFTLENBQUNpRCxLQUFLLENBQUNULE1BQU0sS0FBSyxFQUFFLEVBQUU7TUFDbEV4QyxTQUFTLENBQUNpRCxLQUFLLEdBQUdqRCxTQUFTLENBQUNpRCxLQUFLLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHaEQsU0FBUyxDQUFDaUQsS0FBSyxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztJQUNwRixDQUFDLE1BQU07TUFDTGhELFNBQVMsQ0FBQ2lELEtBQUssR0FBRyxFQUFFO0lBQ3RCO0lBQ0EsSUFBSWpELFNBQVMsQ0FBQ29ELE1BQU0sS0FBSyxHQUFHLEVBQUU7TUFDNUI7TUFDQSxJQUFNQyxLQUFLLEdBQUcsUUFBUTtNQUN0QnJELFNBQVMsQ0FBQ3NELDJCQUEyQixHQUFHLENBQUMsQ0FBQ3RELFNBQVMsQ0FBQ3VELGFBQWEsQ0FBQ0MsS0FBSyxDQUFDSCxLQUFLLENBQUM7TUFDOUUsSUFBSXJELFNBQVMsQ0FBQ3NELDJCQUEyQixFQUFFO1FBQ3pDO1FBQ0F0RCxTQUFTLENBQUN1RCxhQUFhLEdBQUd2RCxTQUFTLENBQUN1RCxhQUFhLENBQUNFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDO01BQ3JFO0lBQ0Y7SUFDQSxJQUFNQyxjQUFjLEdBQUc7TUFDckJDLFNBQVMsRUFBRSxVQUFVO01BQ3JCQyxJQUFJLEVBQUUsa0JBQWtCO01BQ3hCQyxJQUFJLEVBQUUsTUFBTTtNQUNaQyxNQUFNLEVBQUUsT0FBTztNQUNmQyxJQUFJLEVBQUUsYUFBYTtNQUNuQkMsTUFBTSxFQUFFLFFBQVE7TUFDaEJDLGFBQWEsRUFBRSxlQUFlO01BQzlCQyx3QkFBd0IsRUFBRSw2QkFBNkI7TUFDdkRDLE1BQU0sRUFBRSxlQUFlO01BQ3ZCQyxXQUFXLEVBQUUsYUFBYTtNQUMxQkMsV0FBVyxFQUFFLGFBQWE7TUFDMUJDLFVBQVUsRUFBRSxZQUFZO01BQ3hCQyxRQUFRLEVBQUUsZ0JBQWdCO01BQzFCQyxPQUFPLEVBQUUsWUFBWTtNQUNyQkMsS0FBSyxFQUFFLFVBQVU7TUFDakJDLE9BQU8sRUFBRTtJQUNYLENBQUM7SUFDRCxJQUFJLENBQUM1QyxxQkFBcUIsQ0FBQzlCLFNBQVMsRUFBRU8sWUFBWSxFQUFFbUQsY0FBYyxDQUFDO0VBQ3JFO0VBQ0EvQyxlQUFlQSxDQUFDWCxTQUFTLEVBQUVPLFlBQVksRUFBRTtJQUN2QztJQUNBLElBQUlQLFNBQVMsQ0FBQ2lELEtBQUssS0FBS0MsU0FBUyxJQUFJbEQsU0FBUyxDQUFDaUQsS0FBSyxDQUFDVCxNQUFNLEtBQUssRUFBRSxFQUFFO01BQ2xFeEMsU0FBUyxDQUFDaUQsS0FBSyxHQUFHakQsU0FBUyxDQUFDaUQsS0FBSyxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBR2hELFNBQVMsQ0FBQ2lELEtBQUssQ0FBQ0QsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7SUFDcEYsQ0FBQyxNQUFNO01BQ0xoRCxTQUFTLENBQUNpRCxLQUFLLEdBQUcsRUFBRTtJQUN0QjtJQUNBLElBQU0wQixjQUFjLEdBQUc7TUFDckJoQixTQUFTLEVBQUUsVUFBVTtNQUNyQkUsSUFBSSxFQUFFLE1BQU07TUFDWmUsT0FBTyxFQUFFLFVBQVU7TUFDbkJDLFNBQVMsRUFBRSxZQUFZO01BQ3ZCakIsSUFBSSxFQUFFLGVBQWU7TUFDckJrQixlQUFlLEVBQUUsaUJBQWlCO01BQ2xDQyxXQUFXLEVBQUUsaUJBQWlCO01BQzlCQyxXQUFXLEVBQUUsYUFBYTtNQUMxQkMsYUFBYSxFQUFFLGFBQWE7TUFDNUJDLEdBQUcsRUFBRSxLQUFLO01BQ1ZDLGNBQWMsRUFBRSxhQUFhO01BQzdCQyxXQUFXLEVBQUUsaUJBQWlCO01BQzlCdEIsTUFBTSxFQUFFLE9BQU87TUFDZnVCLGFBQWEsRUFBRSxVQUFVO01BQ3pCQyxRQUFRLEVBQUUsVUFBVTtNQUNwQkMsSUFBSSxFQUFFLE1BQU07TUFDWkMsSUFBSSxFQUFFLE1BQU07TUFDWm5CLFdBQVcsRUFBRSxhQUFhO01BQzFCQyxVQUFVLEVBQUUsWUFBWTtNQUN4QkMsUUFBUSxFQUFFLGdCQUFnQjtNQUMxQkMsT0FBTyxFQUFFLFlBQVk7TUFDckJDLEtBQUssRUFBRSxVQUFVO01BQ2pCQyxPQUFPLEVBQUU7SUFDWCxDQUFDO0lBQ0QsSUFBSSxDQUFDNUMscUJBQXFCLENBQUM5QixTQUFTLEVBQUVPLFlBQVksRUFBRW9FLGNBQWMsQ0FBQztFQUNyRTtFQUNBL0QsWUFBWUEsQ0FBQ1osU0FBUyxFQUFFTyxZQUFZLEVBQUU7SUFDcEM7SUFDQSxJQUFJUCxTQUFTLENBQUNpRCxLQUFLLEtBQUtDLFNBQVMsSUFBSWxELFNBQVMsQ0FBQ2lELEtBQUssQ0FBQ1QsTUFBTSxLQUFLLEVBQUUsRUFBRTtNQUNsRXhDLFNBQVMsQ0FBQ2lELEtBQUssR0FBR2pELFNBQVMsQ0FBQ2lELEtBQUssQ0FBQ0QsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUdoRCxTQUFTLENBQUNpRCxLQUFLLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0lBQ3BGLENBQUMsTUFBTTtNQUNMaEQsU0FBUyxDQUFDaUQsS0FBSyxHQUFHLEVBQUU7SUFDdEI7SUFDQSxJQUFNd0MsV0FBVyxHQUFHO01BQ2xCOUIsU0FBUyxFQUFFLFVBQVU7TUFDckJFLElBQUksRUFBRSxNQUFNO01BQ1pDLE1BQU0sRUFBRSxPQUFPO01BQ2ZDLElBQUksRUFBRSxhQUFhO01BQ25CaUIsV0FBVyxFQUFFLGFBQWE7TUFDMUJVLFFBQVEsRUFBRSxXQUFXO01BQ3JCSixRQUFRLEVBQUUsVUFBVTtNQUNwQmpCLFdBQVcsRUFBRSxhQUFhO01BQzFCQyxVQUFVLEVBQUUsWUFBWTtNQUN4QkMsUUFBUSxFQUFFLGdCQUFnQjtNQUMxQkMsT0FBTyxFQUFFLFlBQVk7TUFDckJDLEtBQUssRUFBRSxVQUFVO01BQ2pCQyxPQUFPLEVBQUU7SUFDWCxDQUFDO0lBQ0QsSUFBSSxDQUFDNUMscUJBQXFCLENBQUM5QixTQUFTLEVBQUVPLFlBQVksRUFBRWtGLFdBQVcsQ0FBQztFQUNsRTtFQUNBNUUsYUFBYUEsQ0FBQ2IsU0FBUyxFQUFFTyxZQUFZLEVBQUU7SUFDckMsSUFBTW9GLFdBQVcsR0FBRzNGLFNBQVMsQ0FBQ3FDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDeEMsSUFBSXVELFdBQVcsR0FBRyxDQUFDO0lBQ25CLElBQUlBLFdBQVcsR0FBR0QsV0FBVyxDQUFDbkQsTUFBTSxFQUFFakMsWUFBWSxDQUFDb0QsU0FBUyxHQUFHZ0MsV0FBVyxDQUFDQyxXQUFXLENBQUMsRUFBRUEsV0FBVyxFQUFFO0lBQ3RHLElBQUlBLFdBQVcsR0FBR0QsV0FBVyxDQUFDbkQsTUFBTSxFQUFFakMsWUFBWSxDQUFDdUQsTUFBTSxHQUFHNkIsV0FBVyxDQUFDQyxXQUFXLENBQUMsRUFBRUEsV0FBVyxFQUFFO0lBQ25HLElBQUlBLFdBQVcsR0FBR0QsV0FBVyxDQUFDbkQsTUFBTSxFQUFFakMsWUFBWSxDQUFDc0YsUUFBUSxHQUFHRixXQUFXLENBQUNDLFdBQVcsQ0FBQyxFQUFFQSxXQUFXLEVBQUU7SUFDckcsT0FBTyxDQUFDckYsWUFBWSxFQUFFQSxZQUFZLENBQUM7RUFDckM7QUFDRjtBQUNBLGVBQWUsSUFBSWIsZUFBZSxFQUFFIn0=
