import '../styles/global.css';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // стилі для тоста

//
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'reflect-metadata';
//import diContainer from '../Server/DI/container';
import ReduxStore from '../Server/Store/ReduxStore';
import clientContainer from "../Server/Store/di/containter";

const reduxStore = new ReduxStore(clientContainer); // ініціалізація модуля ReduxStore, налаштовано конфігурацію, саги та фабрику SAGA
const { wrapper } = reduxStore; // екземпляр для синхронізації стану серверного та клієнтського Store

/*
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}*/

//export default function App({ Component, pageProps }) { // головний кореневий компонент всієї програми, загортає кожну сторінку проекту
export default function App({ Component, ...rest }) {
  // глобальна доступність (виклик з будь-якої сторінки toast/error/success), життєвий цикл при навігації (не треба перемальовувати), запобігання дублюванню 
  // <Component {...pageProps}/> - поточна сторінка з props (серверні дані з getServerSideProps)

    // - useWrappedStore створює СИНГЛТОН клієнтського Redux Store під час першого рендеру в браузері.
    // - етап Hydration, зчитування JSON із тегу <script id="__NEXT_DATA__">, виклик store.dispatch({ type: HYDRATE, payload: ... }), перенесення даних в клієнтський Store
    const { store, props } = wrapper.useWrappedStore(rest); // створення довгоживучого клієнтського Redux Store у браузері
    const { pageProps } = props;
  return(
    <>
    <Provider store={store}>  {/*Обгортає весь додаток у React Redux Context для можливості викликати dispatch (const dispatch = useDispatch())*/}
      <PersistGate loading={null} persistor={reduxStore.persistor}> {/* зчитування стану із localStorage */}
      <Component {...pageProps}/> 

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false} // показати індикатор часу внизу
        newestOnTop={false} // нові тости-повідомлення зʼявляються нижче старих
        closeOnClick
        //rtl={false} // порядок тексту
        ltr = {true}
        pauseOnFocusLoss // таймер на паузі під час переключення користувача на іншу вкладку
        draggable // змахнути тост
        pauseOnHover // тост на паузі, доки миша "висить" на ньому
        theme="light"
      />
      </PersistGate>
      </Provider>
    </>
  )
}
//export default wrapper.withRedux(App);

/*
<Provider store={reduxStoreInstance.state}></Provider>
      <PersistGate loading={null} persistor={reduxStoreInstance.persistor}></PersistGate>*/