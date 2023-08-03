interface User {
  id: number; //PK
  username: string;
  password: string;
  profile: string;
  security_question_1_id: number; //FK
  security_answer_1: string;
  security_question_2_id: number; //FK
  security_answer_2: string;
  security_question_3_id: number; //FK
  security_answer_3: string;
  currently_online: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default User;
