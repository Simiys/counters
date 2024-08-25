import { Button, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState, useRef } from 'react';

const PATH = 'http://147.45.154.176:8080/api/';

const getRequest = (request, login, type) => {
  const encodedType = encodeURIComponent(type);

  return fetch(PATH + request + '?login=' + encodeURIComponent(login) + '&type=' + encodedType, {
    method: 'GET'
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
};

const postRequest = (request, body) => {
  return fetch(PATH + request, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.ok;
  });
};

export const PhotosPage = () => {
  const [allCount, setAllCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const [images, setImages] = useState([]);
  const [source, setSource] = useState([]);
  const [resp, setResp] = useState([]);
  const [display, setDisplay] = useState(4);
  const [type, setType] = useState('CОЛО');

  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const [seconds, setSeconds] = useState(2000);
  const [login, setLogin] = useState('');

  const [index, setIndex] = useState(0);

  const types = [
    'Нева 101 1S0',
    'ЦЭ6807П, СЕ 101 R5.1 145 М6',
    'Меркурий 201.5',
    'Меркурий 202.5',
    'Меркурий 201.1',
    'СЕ 101 R5 144 М6',
    'СЕ 101 S6 145 M6',
    'МАРС-1,0-11-Р4-5(60)-М',
    'Нева 103 1SO',
    'СО-51ПК',
    'Нева 301 1S0',
    'СО-2М',
    'СО-2',
    'ЦЭ6807Б ',
    'СО-ИБМ3',
    'СОЛО',
    'Гранит-1',
    'СЕ 101 R5 145 M6',
    'Меркурий 203.1',
    'СО-И449',
    'СО-5',
    'Лейне Электро-01',
    'Меркурий-203.1 31826-07',
    'СЕ 200 S6 145 M6',
    'СОЛО-1S',
    'СО-505',
    'СЕ 200 R5 145 М6',
    'СО-2М2',
    'ЦЭ6807БК',
    'СЕ 101',
    'Нева 103 1S0',
    'ЦЭ6807В',
    'Меркурий 201.7',
    'СОЭ-52/50-11Ш',
    'СЕ 101 S6 145',
    'Ладога 01.02',
    'СЕ 101 S10 144 М6',
    'ЦЭ6807-1П',
    'СО-И446',
    'СЕ 200 ',
    'СЭО-1.15.402 ',
    'СО-ЭЭ6706',
    'СО-И4491М2-5',
    'Нева-101 1SO',
    'Нева-103 1SO',
    'СЭО-1.15.702',
    'СЭО-1.12.402/1',
    'СО-И449М1-2',
    'СО-И449М2-5',
    'СО-5У',
    'СО-50МЭ',
    'СОЭ-52',
    'СОЭ-52/60-01Ш',
    'СОЭ-52/60-31Ш',
    'СО-ЭУ10',
    'СЭО-1.12.402'
  ];

  useEffect(() => {
    if (isRunning && source.length !== 0) {
      const loadImages = () => {
        setResp((prevResp) => {
          const newResp = prevResp.concat(images);
          const arr = [];
          let currentIndex = index;

          for (let j = 0; j < display; j++) {
            arr.push(source[currentIndex]);
            currentIndex++;
            if (currentIndex === source.length) {
              const finalResp = newResp.concat(arr);
              sendData(finalResp);
              setSource([]);
              currentIndex = 0;
              fetchPhotos();
              break;
            }
          }

          setImages(arr);
          setIndex(currentIndex);

          return newResp;
        });
      };

      intervalRef.current = setInterval(loadImages, seconds);

      return () => clearInterval(intervalRef.current);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [isRunning, display, source, index]);

  const sendData = (data) => {
    let imgs = data;
    for (let i = 0; i < imgs.length; i++) {
      imgs[i].status = imgs[i].status === 'UNCHECKED' ? 'CHECKED' : imgs[i].status;
    }
    let request = {
      photos: imgs,
      login: login
    };
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
    fetchTypeInfo(e.target.value);
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

  const fetchTypeInfo = (type) => {
    const encodedType = encodeURIComponent(type);
    fetch(PATH + 'cInfo?type=' + encodedType, { method: 'GET' })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setAllCount(data[0]);
        setCheckedCount(data[1]);
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
          <Select labelId="select-label" id="select" value={type} label="Выберите опцию" onChange={handleSetType}>
            {types.map((typ, i) => (
              <MenuItem id={i} value={typ}>
                {typ}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField sx={{ width: 100 }} label="Всего" value={allCount}>
          {allCount}
        </TextField>
        <TextField sx={{ width: 100 }} label="Обработано" value={checkedCount}>
          {checkedCount}
        </TextField>
      </Box>
    </Box>
  );
};
