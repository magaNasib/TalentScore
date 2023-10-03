import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IQuestion, IStage } from "../types";
import getToken from "helper/getToken";
import useAuth from "hooks/useAuth";



function GetStage() {
  const accessToken = getToken()
  const stageApi = createApi(
    {
      reducerPath: "stageApi",
      baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_BASE_URL
      }),
      endpoints: (builder) => ({
        getStage: builder.query<IStage[], void>({
          query: () => ({
            url: "stage-parent-lists/",
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          }),
        }),
        getSubStage: builder.query<IStage[], void>({
          query: () => ({
            url: "stage-parent-lists/",
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          }),
        }),
        getQuestions: builder.query<IQuestion[], string | undefined>({
          query: (subStageName) => ({
            url: `question-lists/${subStageName}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          })
        }),
        getDependQuestions: builder.query<IQuestion[], { subSlugName?: string; dependQuestionId?: number }>({

          query: ({ subSlugName, dependQuestionId }) => ({
            url: `question-lists/${subSlugName}/${dependQuestionId}`,
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          }),
        }),
      }),
    }
  );
  const {
    useGetStageQuery,
    useGetSubStageQuery,
    useGetQuestionsQuery,
    useGetDependQuestionsQuery,
  } = stageApi;

  return { useGetStageQuery, useGetQuestionsQuery, stageApi }
}

// export const stageApi = createApi(
//   {
//     reducerPath: "stageApi",
//     baseQuery: fetchBaseQuery({
//       baseUrl: import.meta.env.VITE_BASE_URL
//     }),
//     endpoints: (builder) => ({
//       getStage: builder.query<IStage[], void>({
//         query: () => ({
//           url: "stage-parent-lists/",
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer `,
//           }
//         }),
//       }),
//       getSubStage: builder.query<IStage[], void>({
//         query: () => ({
//           url: "stage-parent-lists/",
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk2NDA2NzQ2LCJpYXQiOjE2OTYzMjAzNDYsImp0aSI6Ijc5ZmVjNzY5N2JiMDQzYTQ5NTRhOWVmYTg0OGY2NGM5IiwidXNlcl9pZCI6NH0.JpGb9bYcigqvS5jy_tEVPC-MxRi4EMf24aXZw9OE_E4`,
//           }
//         }),
//       }),
//       getQuestions: builder.query<IQuestion[], string | undefined>({
//         query: (subStageName) => `question-lists/${subStageName}`,
//       }),
//       getDependQuestions: builder.query<
//         IQuestion[],
//         { subSlugName?: string; dependQuestionId?: number }
//       >({
//         query: ({ subSlugName, dependQuestionId }) =>
//           `question-lists/${subSlugName}/${dependQuestionId}`,
//       }),
//     }),
//   }
// );

// export const {
//   useGetStageQuery,
//   useGetSubStageQuery,
//   useGetQuestionsQuery,
//   useGetDependQuestionsQuery,
// } = stageApi;


export default GetStage