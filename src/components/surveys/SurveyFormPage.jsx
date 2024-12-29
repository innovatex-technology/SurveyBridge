import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SurveyFormPage() {
  const [surveyTitle, setSurveyTitle] = useState('');
  const [surveyDescription, setSurveyDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();

  // Add a new question
  const handleAddQuestion = (type) => {
    const newQuestion = { id: Date.now(), type, text: '', options: [], maxRating: 5 };
    setQuestions([...questions, newQuestion]);
  };

  // Handle question text change
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  // Handle option change (for multiple-choice and multi-select)
  const handleOptionChange = (index, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new option
  const handleAddOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push('');
    setQuestions(updatedQuestions);
  };

  // Remove a question
  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Save survey
  const handleSaveSurvey = () => {
    const survey = { title: surveyTitle, description: surveyDescription, questions };
    const surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push(survey);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    // Redirect to the /user-survey route
    navigate('/surveys', { state: { survey } });
  };

  // Handle answer selection/input
  const handleAnswerChange = (questionIndex, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = value;
    setAnswers(updatedAnswers);
  };

  // Handle multi-select answer change
  const handleMultiSelectChange = (questionIndex, optionValue) => {
    const updatedAnswers = [...answers];
    const currentAnswer = updatedAnswers[questionIndex] || [];
    if (currentAnswer.includes(optionValue)) {
      updatedAnswers[questionIndex] = currentAnswer.filter((val) => val !== optionValue);
    } else {
      updatedAnswers[questionIndex] = [...currentAnswer, optionValue];
    }
    setAnswers(updatedAnswers);
  };

  // Handle rating answer change
  const handleRatingChange = (questionIndex, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionIndex] = value;
    setAnswers(updatedAnswers);
  };

  // Toggle preview mode
  const togglePreview = () => {
    setIsPreview(!isPreview);
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };

  // Navigate questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Create New Survey</h2>

      {isPreview ? (
        // Quiz Competition Preview
        <div className="border p-4 rounded bg-gray-50">
          <h3 className="text-xl font-bold">{surveyTitle || 'Untitled Quiz'}</h3>
          <p className="text-gray-600 mb-4">{surveyDescription || 'No description provided'}</p>
          <div className="mt-4">
            {questions.length > 0 ? (
              <div>
                <p className="font-semibold">
                  {currentQuestionIndex + 1}. {questions[currentQuestionIndex].text || 'Untitled Question'}
                </p>
                {questions[currentQuestionIndex].type === 'multiple-choice' && (
                  <ul className="mt-2">
                    {questions[currentQuestionIndex].options.map((option, i) => (
                      <li key={i} className="mb-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`question-${currentQuestionIndex}`}
                            value={option}
                            onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                            className="mr-2"
                          />
                          {option || 'Untitled Option'}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {questions[currentQuestionIndex].type === 'multi-select' && (
                  <ul className="mt-2">
                    {questions[currentQuestionIndex].options.map((option, i) => (
                      <li key={i} className="mb-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            value={option}
                            onChange={(e) => handleMultiSelectChange(currentQuestionIndex, option)}
                            className="mr-2"
                          />
                          {option || 'Untitled Option'}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
                {questions[currentQuestionIndex].type === 'rating' && (
                  <div className="mt-2">
                    {[...Array(questions[currentQuestionIndex].maxRating)].map((_, i) => (
                      <label key={i} className="mr-2">
                        <input
                          type="radio"
                          name={`rating-${currentQuestionIndex}`}
                          value={i + 1}
                          onChange={(e) => handleRatingChange(currentQuestionIndex, i + 1)}
                          className="hidden"
                        />
                        <span className="text-yellow-500 text-xl cursor-pointer">★</span>
                      </label>
                    ))}
                  </div>
                )}
                {questions[currentQuestionIndex].type === 'text' && (
                  <textarea
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                    className="w-full px-4 py-2 border rounded mt-2"
                    placeholder="Your answer"
                  />
                )}
              </div>
            ) : (
              <p className="text-gray-500">No questions added yet.</p>
            )}
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="bg-gray-300 text-black px-4 py-2 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <button
            onClick={togglePreview}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back to Edit
          </button>
        </div>
      ) : (
        // Edit Survey Form
        <>
          <div>
            <label>Survey Title:</label>
            <input
              type="text"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="Survey Title"
            />
          </div>

          <div>
            <label>Description:</label>
            <textarea
              value={surveyDescription}
              onChange={(e) => setSurveyDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded mb-4"
              placeholder="Survey Description"
            />
          </div>

          <div>
            <h3 className="font-bold">Questions</h3>
            {questions.map((question, index) => (
              <div key={question.id} className="mb-4 border p-4 rounded bg-gray-100">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  className="w-full px-4 py-2 border rounded mb-2"
                  placeholder="Question text"
                />
                {(question.type === 'multiple-choice' || question.type === 'multi-select') && (
                  <div className="mt-2">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center mb-2">
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                          className="w-full px-4 py-2 border rounded"
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddOption(index)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded mt-2"
                    >
                      Add Option
                    </button>
                  </div>
                )}
                {question.type === 'rating' && (
                  <div className="mt-2">
                    <label>Max Rating:</label>
                    <input
                      type="number"
                      value={question.maxRating}
                      onChange={(e) =>
                        handleQuestionChange(index, { ...questions[index], maxRating: Number(e.target.value) })
                      }
                      className="w-20 px-2 py-1 border rounded ml-2"
                    />
                  </div>
                )}
                <button
                  onClick={() => handleRemoveQuestion(index)}
                  className="text-red-600 mt-2 hover:text-red-800"
                >
                  Remove Question
                </button>
              </div>
            ))}
          </div>

          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => handleAddQuestion('multiple-choice')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Multiple Choice Question
            </button>
            <button
              onClick={() => handleAddQuestion('multi-select')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Multi-Select Question
            </button>
            <button
              onClick={() => handleAddQuestion('rating')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Rating Question
            </button>
            <button
              onClick={() => handleAddQuestion('text')}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Add Text Question
            </button>
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => window.history.back()}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Cancel
        </button>
        <button
          onClick={togglePreview}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Preview
        </button>
        <button
          onClick={handleSaveSurvey}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Save
        </button>
        <button
          onClick={handleSaveSurvey}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Publish
        </button>
      </div>

    </div>
  );
}
