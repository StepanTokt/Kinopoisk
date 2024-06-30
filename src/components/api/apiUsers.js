import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApiSlice = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3030/api/v1' }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: ({ username, password }) => ({
        url: '/login',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          username,
          password,
        },
      }),
    }),
    rateMovie: builder.mutation({
      query: ({ movieId, user_rate, token }) => {
        // console.log("movieId:", movieId, "user_rate:", user_rate, "token:", token); // Вывод параметров в консоль
        return {
          url: '/rateMovie',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: {
            movieId,
            user_rate,
          },
        };
      },
    }),
    
  }),
});

export const { useLoginUserMutation, useRateMovieMutation } = authApiSlice;
