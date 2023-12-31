/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';

import { FormField, Loader } from '../components';
import axios from 'axios';

interface MyResponseData {
  base64ImageData: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const defaultFormValues = { name: '', prompt: '', photo: '' };
  const [form, setForm] = useState(defaultFormValues);
  const [generatingImg, setGeneratingImg] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await axios.post<MyResponseData>(
          '/.netlify/functions/generate-image',

          {
            prompt: form.prompt,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const { base64ImageData } = response.data;
        setForm({
          ...form,
          photo: `data:image/jpeg;base64,${base64ImageData}`,
        });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please provide proper prompt');
    }
  };

  const handleGenerateImage = () => {
    setGeneratingImg(true);
    generateImage()
      .then(() => {
        setGeneratingImg(false);
      })
      .catch((error) => {
        console.error('Error generating image:', error);
        setGeneratingImg(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(form);

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await axios.post('/.netlify/functions/createPost', {
          ...form,
        });
        if (response.status === 200) {
          alert('Success');
          navigate('/');
        }
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>Create</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w-[500px]'>
          Create imaginative and visually stunning images
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName='Your Name'
            type='text'
            name='name'
            placeholder='Ex., john doe'
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            labelName='Prompt'
            type='text'
            name='prompt'
            placeholder='An Impressionist oil painting of sunflowers in a purple vase…'
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-contain'
              />
            ) : (
              <img
                src={preview}
                alt='preview'
                className='w-9/12 h-9/12 object-contain opacity-40'
              />
            )}

            {generatingImg && (
              <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={handleGenerateImage}
            className=' text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
            ** Once you have created the image you want, you can share it with
            others in the community **
          </p>
          <button
            type='submit'
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
