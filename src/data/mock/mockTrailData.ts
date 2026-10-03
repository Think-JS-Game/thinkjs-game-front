import { Module } from '@/types/trail';
import { Achievement } from '@/types/student';

export const mockAvatars = [
  { id: 'avatar-1', name: 'Mascote Bot', icon: '🤖' },
  { id: 'avatar-2', name: 'Astronauta', icon: '👨‍🚀' },
  { id: 'avatar-3', name: 'Ninja Code', icon: '🥷' },
  { id: 'avatar-4', name: 'Dev Cat', icon: '🐱' },
  { id: 'avatar-5', name: 'Gamer Pixel', icon: '🎮' },
  { id: 'avatar-6', name: 'Rocket Girl', icon: '🚀' },
  { id: 'avatar-7', name: 'Super Hero', icon: '🦸' },
  { id: 'avatar-8', name: 'Wizard JS', icon: '🧙' },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Primeiros Passos',
    description: 'Completou a primeira lição com sucesso.',
    icon: 'star',
    unlockedAt: '12/08/2026',
  },
  {
    id: 'ach-2',
    title: 'Mestre da Segurança',
    description: 'Aprendeu a criar senhas seguras no módulo Básico.',
    icon: 'shield',
    unlockedAt: '15/08/2026',
  },
  {
    id: 'ach-3',
    title: 'Hello, JS World!',
    description: 'Executou seu primeiro comando JavaScript.',
    icon: 'terminal',
    unlockedAt: '20/08/2026',
  },
  {
    id: 'ach-4',
    title: 'Super Streak (3 dias)',
    description: 'Manteve uma sequência de 3 dias de estudo ininterruptos.',
    icon: 'flame',
    unlockedAt: '22/08/2026',
  },
  {
    id: 'ach-5',
    title: 'Dev Intermediário',
    description: 'Desbloqueou o módulo de Estruturas de Controle.',
    icon: 'code',
  },
  {
    id: 'ach-6',
    title: 'Especialista em Bugs',
    description: 'Resolveu 10 exercícios de código na primeira tentativa.',
    icon: 'zap',
  },
];

export const mockModules: Module[] = [
  {
    id: 'mod-basico-1',
    level: 'basic',
    title: 'Módulo 1: O Computador e a Internet',
    description: 'Funcionamento de computadores, atalhos de teclado, navegadores e segurança digital.',
    order: 1,
    lessons: [
      {
        id: 'les-basico-1-1',
        moduleId: 'mod-basico-1',
        title: 'Lição 1: Hardware e Software',
        description: 'Entenda a diferença entre a parte física e os programas do computador.',
        order: 1,
        xpReward: 25,
        questions: [
          {
            id: 'q-bas-1-1',
            lessonId: 'les-basico-1-1',
            type: 'multiple-choice',
            statement: 'Qual dos itens abaixo é um exemplo de HARDWARE (parte física)?',
            options: [
              { id: 'opt-1', text: 'Teclado e Monitor' },
              { id: 'opt-2', text: 'Navegador Google Chrome' },
              { id: 'opt-3', text: 'Sistema Operacional Windows' },
              { id: 'opt-4', text: 'Jogo instalado no computador' },
            ],
            correctOptionId: 'opt-1',
            explanation: 'Hardware é toda a parte física tangível do computador, como teclado, mouse e monitor.'
          },
          {
            id: 'q-bas-1-2',
            lessonId: 'les-basico-1-1',
            type: 'multiple-choice',
            statement: 'Qual atalho de teclado é universalmente usado para COPIAR um texto selecionado?',
            options: [
              { id: 'opt-a', text: 'Ctrl + V (ou Cmd + V)' },
              { id: 'opt-b', text: 'Ctrl + C (ou Cmd + C)' },
              { id: 'opt-c', text: 'Ctrl + Z (ou Cmd + Z)' },
              { id: 'opt-d', text: 'Ctrl + X (ou Cmd + X)' },
            ],
            correctOptionId: 'opt-b',
            explanation: 'Ctrl + C copia o conteúdo selecionado para a área de transferência.'
          }
        ],
        resources: [
          {
            id: 'res-1',
            title: 'O que é um Computador?',
            type: 'video',
            url: 'https://youtube.com',
          },
          {
            id: 'res-2',
            title: 'Guia de Atalhos Essenciais no Teclado',
            type: 'article',
            url: 'https://wikipedia.org',
          }
        ]
      },
      {
        id: 'les-basico-1-2',
        moduleId: 'mod-basico-1',
        title: 'Lição 2: Senhas Seguras e Cibersegurança',
        description: 'Como criar senhas fortes e proteger suas contas na internet.',
        order: 2,
        xpReward: 25,
        questions: [
          {
            id: 'q-bas-2-1',
            lessonId: 'les-basico-1-2',
            type: 'multiple-choice',
            statement: 'Qual destas senhas é a mais segura para proteger sua conta?',
            options: [
              { id: 'opt-1', text: '123456' },
              { id: 'opt-2', text: 'senha123' },
              { id: 'opt-3', text: 'Th1nkJS#2026!' },
              { id: 'opt-4', text: 'meunome2026' },
            ],
            correctOptionId: 'opt-3',
            explanation: 'Senhas seguras combinam letras maiúsculas, minúsculas, números e símbolos especiais.'
          }
        ]
      }
    ]
  },
  {
    id: 'mod-iniciante-1',
    level: 'beginner',
    title: 'Módulo 1: Primeiros Passos com JavaScript',
    description: 'Entenda como utilizar sintaxe JavaScript, console e variáveis.',
    order: 1,
    lessons: [
      {
        id: 'les-iniciante-1-1',
        moduleId: 'mod-iniciante-1',
        title: 'Lição 1: Seu Primeiro Hello World',
        description: 'Exiba mensagens na tela usando console.log.',
        order: 1,
        xpReward: 30,
        questions: [
          {
            id: 'q-ini-1-1',
            lessonId: 'les-iniciante-1-1',
            type: 'code',
            statement: 'Escreva um comando console.log que imprima exatamente "Hello, World!" na tela.',
            starterCode: 'console.log("Hello, World!");',
            expectedOutput: ['Hello, World!'],
            solutionCode: 'console.log("Hello, World!");',
            explanation: 'console.log() aceita textos entre aspas para exibir no console.'
          },
          {
            id: 'q-ini-1-2',
            lessonId: 'les-iniciante-1-1',
            type: 'multiple-choice',
            codeSnippet: 'console.log("ThinkJS");',
            statement: 'O que o código acima irá imprimir no console?',
            options: [
              { id: 'o-1', text: 'ThinkJS' },
              { id: 'o-2', text: '"ThinkJS"' },
              { id: 'o-3', text: 'console.log' },
              { id: 'o-4', text: 'Nada, vai dar erro' },
            ],
            correctOptionId: 'o-1',
            explanation: 'console.log imprime o texto contido entre as aspas sem exibir as aspas no terminal.'
          }
        ]
      }
    ]
  }
];
