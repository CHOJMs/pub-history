function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* eslint-disable */

/* global-module */
class ImageUtil {
  constructor() {
    _defineProperty(this, "Compressor", window.Compressor);
    _defineProperty(this, "__imageCompressor", (source, options) => {
      return new Promise((resolve, reject) => {
        var opt = {
          maxWidth: options.maxWidth,
          maxHeight: options.maxHeight,
          convertSize: options.convertSize,
          // 이 용량을 초과하는 이미지는 JPEG 확장자로 변환되며 용량이 90% 수준으로 압축됨.
          quality: options.quality,
          success: function success(compressedImage) {
            resolve(compressedImage);
          },
          error: function error(err) {
            void 0;
            reject(err);
          }
        };
        new Compressor(source, opt);
      });
    });
  }
  compressImage(blobFile, options) {
    var _arguments = arguments,
      _this = this;
    return _asyncToGenerator(function* () {
      var constantNumber = _arguments.length > 2 && _arguments[2] !== undefined ? _arguments[2] : 0.12;
      if (blobFile.size <= options.targetCompressVolume) {
        void 0;
        return blobFile;
      }
      var stopped = false;
      var count = 0;
      var compressedImage;
      var targetCompressionRatio = Math.round(options.targetCompressVolume / blobFile.size * 100) / 100;
      var startQuality = targetCompressionRatio + constantNumber; // 상수값을 더해주는 이유: 과도하게 압축되는 것을 보정하는 수치. (클수록 압축률 떨어지고 이미지 품질은 좋아짐.)
      startQuality = startQuality > 0.8 ? 0.8 : startQuality;
      options.quality = startQuality;
      void 0;
      void 0;
      while (!stopped) {
        count++;
        compressedImage = yield _this.__imageCompressor(blobFile, options);
        void 0;
        var compressionRatio = Math.round((1 - compressedImage.size / blobFile.size) * 10000) / 100;
        void 0;
        if (compressedImage.size < options.targetCompressVolume) {
          stopped = true;
        } else {
          options.quality = Math.round((options.quality - 0.1) * 100) / 100;
        }
      }
      return compressedImage;
    })();
  }
}
export default new ImageUtil();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVycy9pbWFnZS11dGlsLmpzIiwibmFtZXMiOlsiSW1hZ2VVdGlsIiwiY29uc3RydWN0b3IiLCJfZGVmaW5lUHJvcGVydHkiLCJ3aW5kb3ciLCJDb21wcmVzc29yIiwic291cmNlIiwib3B0aW9ucyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwib3B0IiwibWF4V2lkdGgiLCJtYXhIZWlnaHQiLCJjb252ZXJ0U2l6ZSIsInF1YWxpdHkiLCJzdWNjZXNzIiwiY29tcHJlc3NlZEltYWdlIiwiZXJyb3IiLCJlcnIiLCJjb21wcmVzc0ltYWdlIiwiYmxvYkZpbGUiLCJfYXJndW1lbnRzIiwiYXJndW1lbnRzIiwiX3RoaXMiLCJfYXN5bmNUb0dlbmVyYXRvciIsImNvbnN0YW50TnVtYmVyIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwic2l6ZSIsInRhcmdldENvbXByZXNzVm9sdW1lIiwic3RvcHBlZCIsImNvdW50IiwidGFyZ2V0Q29tcHJlc3Npb25SYXRpbyIsIk1hdGgiLCJyb3VuZCIsInN0YXJ0UXVhbGl0eSIsIl9faW1hZ2VDb21wcmVzc29yIiwiY29tcHJlc3Npb25SYXRpbyJdLCJzb3VyY2VzIjpbImhlbHBlcnMvaW1hZ2UtdXRpbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4vKiBnbG9iYWwtbW9kdWxlICovXG5jbGFzcyBJbWFnZVV0aWwge1xuICBDb21wcmVzc29yID0gd2luZG93LkNvbXByZXNzb3I7XG4gIGFzeW5jIGNvbXByZXNzSW1hZ2UoYmxvYkZpbGUsIG9wdGlvbnMsIGNvbnN0YW50TnVtYmVyID0gMC4xMikge1xuICAgIGlmIChibG9iRmlsZS5zaXplIDw9IG9wdGlvbnMudGFyZ2V0Q29tcHJlc3NWb2x1bWUpIHtcbiAgICAgIHZvaWQgMDtcbiAgICAgIHJldHVybiBibG9iRmlsZTtcbiAgICB9XG4gICAgbGV0IHN0b3BwZWQgPSBmYWxzZTtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIGxldCBjb21wcmVzc2VkSW1hZ2U7XG4gICAgY29uc3QgdGFyZ2V0Q29tcHJlc3Npb25SYXRpbyA9IE1hdGgucm91bmQob3B0aW9ucy50YXJnZXRDb21wcmVzc1ZvbHVtZSAvIGJsb2JGaWxlLnNpemUgKiAxMDApIC8gMTAwO1xuICAgIGxldCBzdGFydFF1YWxpdHkgPSB0YXJnZXRDb21wcmVzc2lvblJhdGlvICsgY29uc3RhbnROdW1iZXI7IC8vIOyDgeyImOqwkuydhCDrjZTtlbTso7zripQg7J207JygOiDqs7zrj4TtlZjqsowg7JWV7LaV65CY64qUIOqyg+ydhCDrs7TsoJXtlZjripQg7IiY7LmYLiAo7YG07IiY66GdIOyVley2leuloCDrlqjslrTsp4Dqs6Ag7J2066+47KeAIO2SiOyniOydgCDsoovslYTsp5AuKVxuICAgIHN0YXJ0UXVhbGl0eSA9IHN0YXJ0UXVhbGl0eSA+IDAuOCA/IDAuOCA6IHN0YXJ0UXVhbGl0eTtcbiAgICBvcHRpb25zLnF1YWxpdHkgPSBzdGFydFF1YWxpdHk7XG4gICAgdm9pZCAwO1xuICAgIHZvaWQgMDtcbiAgICB3aGlsZSAoIXN0b3BwZWQpIHtcbiAgICAgIGNvdW50Kys7XG4gICAgICBjb21wcmVzc2VkSW1hZ2UgPSBhd2FpdCB0aGlzLl9faW1hZ2VDb21wcmVzc29yKGJsb2JGaWxlLCBvcHRpb25zKTtcbiAgICAgIHZvaWQgMDtcbiAgICAgIGNvbnN0IGNvbXByZXNzaW9uUmF0aW8gPSBNYXRoLnJvdW5kKCgxIC0gY29tcHJlc3NlZEltYWdlLnNpemUgLyBibG9iRmlsZS5zaXplKSAqIDEwMDAwKSAvIDEwMDtcbiAgICAgIHZvaWQgMDtcbiAgICAgIGlmIChjb21wcmVzc2VkSW1hZ2Uuc2l6ZSA8IG9wdGlvbnMudGFyZ2V0Q29tcHJlc3NWb2x1bWUpIHtcbiAgICAgICAgc3RvcHBlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zLnF1YWxpdHkgPSBNYXRoLnJvdW5kKChvcHRpb25zLnF1YWxpdHkgLSAwLjEpICogMTAwKSAvIDEwMDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbXByZXNzZWRJbWFnZTtcbiAgfVxuICBfX2ltYWdlQ29tcHJlc3NvciA9IChzb3VyY2UsIG9wdGlvbnMpID0+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb3B0ID0ge1xuICAgICAgICBtYXhXaWR0aDogb3B0aW9ucy5tYXhXaWR0aCxcbiAgICAgICAgbWF4SGVpZ2h0OiBvcHRpb25zLm1heEhlaWdodCxcbiAgICAgICAgY29udmVydFNpemU6IG9wdGlvbnMuY29udmVydFNpemUsXG4gICAgICAgIC8vIOydtCDsmqnrn4nsnYQg7LSI6rO87ZWY64qUIOydtOuvuOyngOuKlCBKUEVHIO2ZleyepeyekOuhnCDrs4DtmZjrkJjrqbAg7Jqp65+J7J20IDkwJSDsiJjspIDsnLzroZwg7JWV7LaV65CoLlxuICAgICAgICBxdWFsaXR5OiBvcHRpb25zLnF1YWxpdHksXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChjb21wcmVzc2VkSW1hZ2UpIHtcbiAgICAgICAgICByZXNvbHZlKGNvbXByZXNzZWRJbWFnZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgdm9pZCAwO1xuICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgbmV3IENvbXByZXNzb3Ioc291cmNlLCBvcHQpO1xuICAgIH0pO1xuICB9O1xufVxuZXhwb3J0IGRlZmF1bHQgbmV3IEltYWdlVXRpbCgpOyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTs7QUFFQTtBQUNBLE1BQU1BLFNBQVMsQ0FBQztFQUFBQyxZQUFBO0lBQUFDLGVBQUEscUJBQ0RDLE1BQU0sQ0FBQ0MsVUFBVTtJQUFBRixlQUFBLDRCQTZCVixDQUFDRyxNQUFNLEVBQUVDLE9BQU8sS0FBSztNQUN2QyxPQUFPLElBQUlDLE9BQU8sQ0FBQyxDQUFDQyxPQUFPLEVB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
