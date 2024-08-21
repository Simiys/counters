import { Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';

const PATH = 'http://localhost:8080/api/';

const getRequest = (request, login, type) => {
  return fetch(PATH + request + '?login=' + login + '&type=' + type, { method: 'GET' }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Обработка ошибок сети
    }
    return response.json();
  });
};
const postRequest = (request, body) => {
  return fetch(PATH + request, {
    // Возвращаем fetch, чтобы возвращать Promise
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok'); // Обработка ошибок сети
    }
    return response.ok; // Возвращаем true или false в зависимости от ответа
  });
};

export const PhotosPage = () => {
  const [images, setImages] = useState([]);
  const [source, setSource] = useState([]);
  const [resp, setResp] = useState([]);
  const [display, setDisplay] = useState(4);
  const [type, setType] = useState('mercury');

  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [seconds, setSeconds] = useState(2000);
  const [login, setLogin] = useState('');

  const [index, setIndex] = useState(0); // Управляемый индекс

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     sendData();

  //     event.preventDefault();
  //     event.returnValue = '';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  useEffect(() => {
    if (isRunning) {
      const loadImages = () => {
        const arr = [];
        let currentIndex = index;

        for (let j = 0; j < display; j++) {
          arr.push(source[currentIndex]);
          currentIndex++;
          if (currentIndex === source.length) {
            sendData();
            currentIndex = 0;
            fetchPhotos();
            break;
          }
        }

        const newResp = resp.concat(arr); // Создаем новый массив на основе текущего `resp` и `arr`
        setResp(newResp); // Устанавливаем новое значение для `resp`
        setImages(arr); // Обновляем изображения
        setIndex(currentIndex); // Обновляем индекс для следующего запуска
      };

      intervalRef.current = setInterval(loadImages, seconds);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isRunning, display, source, index]);

  const sendData = () => {
    let imgs = [...resp];
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].status = imgs[i].status === 'UNCHECKED' ? 'CHECKED' : imgs[i].status;
    }
    let request = {
      photos: imgs,
      sentPhotos: source,
      login: login
    };
    console.log(request);
    postRequest('photos', request)
      .then((resp) => {
        if (!resp) {
          fetchPhotos();
        }
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  };

  const handleAddDoubt = (obj, i) => {
    const imgs = [...images];
    obj.status = obj.status === 'DOUBT' ? 'CHECKED' : 'DOUBT';
    imgs[i] = obj;
    setImages(imgs);
  };

  const handleAddIncorrect = (obj, i) => {
    const imgs = [...images];
    obj.status = obj.status === 'INCORRECT' ? 'CHECKED' : 'INCORRECT';
    imgs[i] = obj;
    setImages(imgs);
  };

  const handleStopButton = () => {
    setIsRunning(false);
  };

  const handleStartButton = () => {
    setIsRunning(true);
  };

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
  };

  const handleSetType = (e) => {
    setType(e.target.value);
  };

  const handleSetDisplay = (e) => {
    setDisplay(e.target.value);
  };

  const fetchPhotos = () => {
    getRequest('photos', login, type)
      .then((data) => {
        setSource(data);
      })
      .catch((error) => {
        console.error('Error fetching photos:', error);
      });
  };

  return (
    <Box gap={1} display="flex" flexDirection="column" alignItems="center" minHeight="100hv" flexWrap="wrap">
      <Box
        gap={5}
        display="flex"
        flexDirection="row"
        alignItems="center"
        flexWrap="wrap"
        sx={{ maxWidth: '1200px', marginBottom: '10px', marginLeft: '0px' }}
      >
        {images.map((pair, i) => (
          <Box display="flex" flexDirection="row" alignItems="center" key={i} gap={2}>
            <Box border={pair.status === 'DOUBT' ? '3px solid yellow' : 'none'}>
              <img
                width={250}
                height={300}
                src={pair.ref}
                alt={'ИИ изорбражение'}
                onClick={() => handleAddDoubt(pair, i)}
              ></img>
            </Box>
            <Box border={pair.status === 'INCORRECT' ? '3px solid red' : 'none'}>
              <img
                width={250}
                height={300}
                src={pair.aiRef}
                alt={'ИИ изорбражение'}
                onClick={() => handleAddIncorrect(pair, i)}
              ></img>
            </Box>
          </Box>
        ))}
      </Box>
      <Box gap={2} display={'flex'} flexDirection="row" alignItems={'center'}>
        <TextField label="Логин" value={login} onChange={handleLoginChange}></TextField>
        <Button variant="outlined" onClick={fetchPhotos}>
          Получить фотографии
        </Button>
        <FormControl>
          <InputLabel id="select-label">Выберите опцию</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            defaultValue={display}
            label="Выберите опцию"
            onChange={handleSetDisplay}
          >
            <MenuItem value="2">1 x 4</MenuItem>
            <MenuItem value="4">2 x 4</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleStopButton}>
          Стоп
        </Button>
        <Button variant="outlined" onClick={handleStartButton} disabled={source.length === 0}>
          Старт
        </Button>

        <FormControl>
          <InputLabel id="select-label">Выберите опцию</InputLabel>
          <Select
            labelId="select-label"
            id="select"
            defaultValue={type}
            label="Выберите опцию"
            onChange={handleSetType}
          >
            <MenuItem value="mercury">Меркурий</MenuItem>
            <MenuItem value="neva">Нева</MenuItem>
            <MenuItem value="so">СО</MenuItem>
            <MenuItem value="skat">СКАТ</MenuItem>
            <MenuItem value="others">Другие</MenuItem>
            <MenuItem value="all">Все</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
