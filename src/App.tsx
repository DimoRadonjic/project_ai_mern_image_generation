import { Link, Route, Routes, BrowserRouter } from 'react-router-dom';

import { logo } from './assets';
import { Home, CreatePost } from './pages';
import { useEffect } from 'react';
import axios from 'axios';

const App = () => {
  useEffect(() => {
    console.log('Attempting to connect to MongoDB function...');
    const connectToMongoDB = async () => {
      try {
        const response = await axios.get('/.netlify/functions/connectToDB');
        console.log('Response from MongoDB function:', response.data);
      } catch (err) {
        alert(err);
      }
    };
    void connectToMongoDB();
  }, []);
  return (
    <>
      <BrowserRouter>
        <header className='w-full flex justify-between items-center bg-white sm:px-8 px-4 py-4 border-b border-b-[#e6ebf4]'>
          <Link to='/'>
            <img src={logo} alt='logo' className='w-28 object-contain' />
          </Link>

          <Link
            to='/create-post'
            className='font-inter font-medium bg-[#6469ff] text-white px-4 py-2 rounded-md'
          >
            Create
          </Link>
        </header>
        <main className='sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/create-post' element={<CreatePost />} />
          </Routes>
        </main>
      </BrowserRouter>
    </>
  );
};

export default App;
