import db from '../db/db.js';

(async function(){
  try{
    const quizRes = await db.query(
      `INSERT INTO quizzes (title, description, level, total_questions, marks_per_question, created_by, tier)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
      ['Tier 2 Test Quiz','Advanced Tier 2 test quiz','hard',3,2,1,2]
    );
    const quizId = quizRes.rows[0].id;
    console.log('QUIZID=' + quizId);

    const q1 = await db.query(
      `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, ai_generated)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [quizId, 'What is 2 + 2?', '3', '4', '5', '6', 'B', 'easy', false]
    );
    console.log('Q1=' + q1.rows[0].id);

    const q2 = await db.query(
      `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, ai_generated)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [quizId, 'Which language is used to build web pages?', 'C++', 'Java', 'JavaScript', 'Python', 'C', 'medium', false]
    );
    console.log('Q2=' + q2.rows[0].id);

    const q3 = await db.query(
      `INSERT INTO questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, ai_generated)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [quizId, 'Choose the chemical formula for water', 'O2', 'H2', 'H2O', 'CO2', 'C', 'hard', false]
    );
    console.log('Q3=' + q3.rows[0].id);

    console.log('DONE');
  }catch(e){
    console.error('ERROR', e);
  } finally{
    process.exit(0);
  }
})();
