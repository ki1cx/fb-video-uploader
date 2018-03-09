// __tests__/index.test.js
import fb from '../index';

jest.mock('../request');
import request from '../request';

const convertFormDataToJson = function (formData) {
  var formDataJSON = {};
  formData.forEach(function(value, key){
    formDataJSON[key] = value;
  });

  return formDataJSON;
}

it('upload - start', async () => {
  expect.assertions(2);

  const fileSize = 100;
  const resp = {
    upload_session_id: 1,
    start_offset: 0,
    end_offset: fileSize,
    video_id: 1000
  };
  const formDataStartJson = require('../fixtures/formData/start');

  request.mockImplementation(() => resp);

  fb.config({
    adAccountId: "1234",
    providerToken: "asdf",
  });
  fb.formData = new FormData();

  const response = await fb.start(fileSize);
  const formDataJson = convertFormDataToJson(fb.formData);

  expect(response).toEqual(resp);
  expect(formDataJson).toEqual(formDataStartJson);
});

it('upload - transfer', async () => {
  expect.assertions(2);

  const fileSize = 100;
  const startOffset = 0;
  const endOffset = fileSize;
  const resp = {
    start_offset: fileSize,
    end_offset: fileSize
  };
  const file = {
    slice: function (start, end) {
      return {size: fileSize, type: ""};
    }
  }
  const formDataTransferJson = require('../fixtures/formData/transfer');

  request.mockImplementation(() => resp);

  fb.config({
    adAccountId: "1234",
    providerToken: "asdf",
  });
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
  const resp = {
    success: true
  };
  const formDataFinishJson = require('../fixtures/formData/finish');

  request.mockImplementation(() => resp);

  fb.config({
    adAccountId: "1234",
    providerToken: "asdf",
  });
  fb.formData = new FormData();

  const responses = await fb.finish(title);
  const formDataJson = convertFormDataToJson(fb.formData);

  expect(responses).toEqual(resp);
  expect(formDataJson).toEqual(formDataFinishJson);
});