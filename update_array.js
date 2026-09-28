const fs = require('fs');
let content = fs.readFileSync('app/page.js', 'utf8');

const regex = /const testimonials = \[([\s\S]*?)\];/;

const newTestimonials = `const testimonials = [
  { name: 'Leonardo Gonzales Mendoza', bairro: 'São Paulo - SP', text: 'Muito satisfeito com o cuidado e a dedicação de toda a equipe. Profissionais excelentes que realmente amam o que fazem. Profissionais excelentes, muito cuidadosos e atenciosos. Demonstraram muita paciência para explicar a rotina de medicações do meu avô e cuidaram dele com muito amor e respeito. Super recomendo! A melhor agência de assistência domiciliar da região, recomendo a todos!', stars: 5 },
  { name: 'Família Silva', bairro: 'São Paulo - SP', text: 'Melhor agência de home care da região. Contratamos um cuidador para o meu pai e a dedicação foi maravilhosa. A equipe técnica da Serenya nos dá total segurança e tranquilidade.', stars: 5 },
  { name: 'Sr. Roberto', bairro: 'Santo André - SP', text: 'Serviço de altíssima qualidade. A supervisão de enfermagem visita minha casa regularmente, tudo muito organizado e focado no bem-estar do idoso. Parabéns pelo trabalho lindo!', stars: 5 },
];`;

content = content.replace(regex, newTestimonials);
fs.writeFileSync('app/page.js', content, 'utf8');
console.log('Update array successful');