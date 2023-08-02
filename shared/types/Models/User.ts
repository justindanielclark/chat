type User = {
  id: number; //PK
  username: string;
  password: string;
  security_question__1_id: string; //FK
  security_answer_1: string;
  security_question__2_id: string; //FK
  security_answer_2: string;
  security_question__3_id: string; //FK
  security_answer_3: string;
  join_date: Date;
  last_login: Date;
};

export default User;
