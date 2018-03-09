// __tests__/index.test.js
import fb from '../index';
jest.mock('../request');
import request from '../request';
const config = require('../fixtures/config');

const convertFormDataToJson = function (formData) {
  var formDataJSON = {};
  formData.forEach(function(value, key){
    formDataJSON[key] = value;
  });

  return formDataJSON;
}

it('upload - start', async () => {
  expect.assertions(2);

  const resp = require('../fixtures/request/start');
  const formDataStartJson = require('../fixtures/formData/start');
  const fileSize = resp.end_offset;

  request.mockImplementation(() => resp);

  fb.config(config);
  fb.formData = new FormData();

  const response = await fb.start(fileSize);
  const formDataJson = convertFormDataToJson(fb.formData);

  expect(response).toEqual(resp);
  expect(formDataJson).toEqual(formDataStartJson);
});

it('upload - transfer', async () => {
  expect.assertions(2);

  const resp = require('../fixtures/request/transfer');
  const formDataTransferJson = require('../fixtures/formData/transfer');
  const fileSize = resp.start_offset;
  const startOffset = 0;
  const endOffset = fileSize;
  const file = {
    slice: function (start, end) {
      return {size: fileSize, type: ""};
    }
  }

  request.mockImplementation(() => resp);

  fb.config(config);
  fb.formData = new FormData();

  const responses = await fb.transfer(file, startOffset, endOffset);
  const formDataJson = convertFormDataToJson(fb.formData);

  expect(responses).toEqual([resp]);
  expect(formDataJson).toEqual(formDataTransferJson);
});

it('upload - finish', async () => {
  expect.assertions(2);

  const title = 'my new video';
  const fileSize = 100;
  const startOffset = 0;
  const endOffset = fileSize;
  const resp = require('../fixtures/request/finish');
  const formDataFinishJson = require('../fixtures/formData/finish');

  request.mockImplementation(() => resp);

  fb.config(config);
  fb.formData = new FormData();

  const responses = await fb.finish(title);
  const formDataJson = convertFormDataToJson(fb.formData);

  expect(responses).toEqual(resp);
  expect(formDataJson).toEqual(formDataFinishJson);
});