const PATH = 'http://localhost:8080/';

export const getRequest = (request) => {
  fetch(PATH + request, { method: 'GET' }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Обработка ошибок сети
    }
    return response.json();
  });
};

export const postRequest = (request, body) => {
  fetch(PATH + request, { method: 'POST', body: body }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Обработка ошибок сети
    }
    return response.json();
  });
};
