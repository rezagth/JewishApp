/**
 * Redux Slice: Community
 * Gère l'état du module communautaire (Q&A)
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Question, QuestionCategory } from '@types/index';

interface CommunityState {
  questions: Question[];
  selectedQuestion: Question | null;
  filteredCategory: QuestionCategory | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  userReputation: number;
}

const initialState: CommunityState = {
  questions: [],
  selectedQuestion: null,
  filteredCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
  userReputation: 0,
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.error = null;
    },
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.unshift(action.payload);
    },
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(
        (q) => q.id === action.payload.id
      );
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    },
    selectQuestion: (state, action: PayloadAction<Question>) => {
      state.selectedQuestion = action.payload;
    },
    setFilterCategory: (
      state,
      action: PayloadAction<QuestionCategory | null>
    ) => {
      state.filteredCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    voteQuestion: (
      state,
      action: PayloadAction<{ id: string; direction: 1 | -1 }>
    ) => {
      const question = state.questions.find((q) => q.id === action.payload.id);
      if (question) {
        question.votes += action.payload.direction;
      }
    },
    setUserReputation: (state, action: PayloadAction<number>) => {
      state.userReputation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setQuestions,
  addQuestion,
  updateQuestion,
  selectQuestion,
  setFilterCategory,
  setSearchQuery,
  voteQuestion,
  setUserReputation,
  setLoading,
  setError,
} = communitySlice.actions;

export default communitySlice.reducer;
