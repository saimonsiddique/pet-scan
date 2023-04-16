import { useState, useEffect, createContext } from "react";
import apiClient from "../../ApiServices/ApiClientService";
import moment from "moment";
import HomeNavBar from "../NavBar/HomeNavBar/HomeNavBar";
import PostCard from "../PostCard/PostCard";
import "./NewsFeed.css";
import QuestionCard from "../QuestionCard/QuestionCard";
import LatestQuestion from "../QuestionCard/subcomponent/LatestQuestion";
import BookAppointment from "../Profile/subcomponents/ProfileContent/BookAppointment";

export const NewsFeedContext = createContext();

const NewsFeed = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [notAnsweredQuestions, setNotAnsweredQuestions] = useState([]);
  const [latestQuestion, setLatestQuestion] = useState([]);
  const [prevQuestion, setPrevQuestion] = useState([]);
  const [answerBox, setAnswerBox] = useState(false);
  const [postCard, setPostCard] = useState(false);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllQuestions();
    // check if user is logged in
    if (localStorage.getItem("accessToken")) {
      // check if user is a vet or not
      const user = localStorage.getItem("userType");
      if (user === "vet") {
        setAnswerBox(true);
      } else {
        setPostCard(true);
      }
    }
  }, []);

  const getAllQuestions = async () => {
    // get all questions
    const allQuestionsfromDB = await apiClient.getFeedQuestions();
    // set latest question
    setLatestQuestion(allQuestionsfromDB[0]);
    // set previous questions
    setPrevQuestion(allQuestionsfromDB.slice(1));
    // set all questions
    setAllQuestions(allQuestionsfromDB);
    // set all answered questions
    const answrNotFound = allQuestionsfromDB.filter(
      (question) => question.isAnswered === false
    );
    setNotAnsweredQuestions(answrNotFound);
  };

  return (
    <NewsFeedContext.Provider
      value={{
        allQuestions,
        setAllQuestions,
        latestQuestion,
        setLatestQuestion,
        prevQuestion,
        setPrevQuestion,
        notAnsweredQuestions,
        setNotAnsweredQuestions,
        answerBox,
        postCard,
      }}
    >
      <section className="feed-container">
        <div className="feed-nav-bar">
          <HomeNavBar />
        </div>
        <div className="feed-content-container">
          <div className="feed-post">
            <div className="post-card">
              {postCard && <PostCard />}
              {!answerBox && <BookAppointment />}
            </div>
            <div className="latest-question">
              {!answerBox && <LatestQuestion question={latestQuestion} />}
            </div>
          </div>
          <div className="feed-questions">
            {answerBox
              ? notAnsweredQuestions.map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    date={moment(question.postDate).format("MMM Do YY")}
                  ></QuestionCard>
                ))
              : prevQuestion.map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    date={moment(question.postDate).format("MMM Do YY")}
                  />
                ))}
          </div>
        </div>
      </section>
    </NewsFeedContext.Provider>
  );
};

export default NewsFeed;
