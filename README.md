<p align="center">
  <a href="#"><img src="https://quizme-image.sfo3.cdn.digitaloceanspaces.com/quizme-github-repo/0.1.0/logo.png" /></a>
</p>

<p align="center">
Elevate your programming skills through quizzes, coding practices, and real-world projects.
</p>
<br/>

## Table of Contents

<p align="center">
  <a href="#why"><strong>Why</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#run"><strong>Run It Locally</strong></a> ·
  <a href="#blogs"><strong>Blogs</strong></a> ·
</p>
<br/>

<p align="center">
  <a href="https://quizme.tech/"><img src="https://quizme-image.sfo3.cdn.digitaloceanspaces.com/quizme-github-repo/0.1.0/question-list.png"></a>
</p>


Drawing from my own experience as a self-taught programmer, <strong> I think the most efficient learning way is through tackling problems and learning things top-down. </strong> So I want to build a programming learning platform to deal with this. I call it: <a href="https://quizme.tech/">QuizMe</a>. You might be curious why I am still determined to build it despite the abundance of existing learning websites. Jump <a href="#why">here</a>.



> 🙋🏻‍♀️ **I don't want to position this project as a quick-interview tool.** That would definitely lose a lot of fun. Instead, I want to instill some captivating content into it, like how to build a mini-compiler or a mini-SQL engine. From my point of view, **programming learning is a long-term journey, not just for the job itself and couldn't be condensed into a 30-day coding camp.**


> 🤖 **QuizMe is currently in beta.** I run this whole building process(from design, product prototyping, frontend, backend, deployment to product operation), and there is no team or company behind. Hence, new features may not be delivered as fast as others. While the FAQ section is ready, please note that coding exercises, code deduction, and project-building sections are still in progress. Although it's not finished, I want to **set the whole building process step by step publicly.**


<br/>

### Why? 🤔 <a name="why"></a>

Why did I create QuizMe, considering the abundance of existing programming learning platforms? Well...

Before creating QuizMe, I've explored other ways just like you did:

#### Issues of online programming learning platforms

Well-known programming learning platforms like FreeCodeCamp and educative.io are already serving well, but they have those two issues:

- **Only for newcomers, but not for old birds with over 5 years experience.** 
  - Tutorials and projects on those plaforms tend to focus **solely on the application layer**, telling you how to use those tools, yet **neglecting the infrasture parts such as operating systems, networking, compilers, and database engines**. 
  - Additionally, most of them fail to address the whole lifecycle of software development, **omitting essential practices like data mocking, git practices, testing (unit and stress), monitoring, user log collection and system design pitfalls**.

- **Lack of group-tailored projects** 
Existing platforms often overlook the specific needs of different user groups. 
For instance, a designer seeking to learn programming may prefer design-specific projects like **design system managment or figma plugins**, rather than unrelated ones like how to build an e-commerce store. 
Similarly, an experienced developer transitioning to Rust might be interested in using it to **build high-performance computing tools** like database engine, rather than starting with an e-education platform. 


#### Issues of learning through books, blogs, docs and videos

While these resources are valuable, they often lack efficiency and take-home quizzes. 

I frequently find myself grappling with a dilemma: **How much have I truly absorbed? Have I misunderstood certain concepts or overlooked crucial points? Is there a quiz platform available that can assess my understanding and highlight any blind spots?**


#### Issues of learning through open-source projects

Undoubtedly, it's feasible to learn programming through studying the source code of open-source projects or actively participating in them. However, it demands a significant amount of time and may not be suitable for software engineers who are subjected to demanding 996 schedules.

**Open-source projects inherently come with certain barriers to entry.** For larger projects, without a solid theoretical foundation and timely issue tracking, one may quickly find themselves overwhelmed and left behind. On the other hand, smaller projects can leave us uncertain about the potential impact on others and whether they will be maintained in the future.

In summary, for most of us with busy schedules, learning through open-source projects might be a meandering path that lacks efficiency.

#### With QuizMe...

If you've also encountered thoses challenges, QuizMe is for you.

QuizMe intends to establish an effective approach to programming learning. It aims to **bridge the gaps between programming theory, algorithms, and projects by offering customized learning materials for specific groups**. Whether you are a designer embarking on the journey of learning programming or a Javascript developer transitioning your tech stack to Rust, QuizMe would help you with tailored resources provided.


<br/>

### Features 🙋🏻‍♀️ <a name="features"></a>

QuizMe is not a third-part tool, but a online programming learning platform. You can visit <a href="https://quizme.tech/">here</a> to give a shot.

#### FAQ section

- Search questions and jump to the answer.(Available)
- A rich text editor for you to write answer.(Still testing)
  -  Highlight and style the text(Bold,Title,Quote etc)
  -  Support both code line and code block.
  -  Support image uploading.

#### Code exercises(Still building, Not available)

#### Code output deduce(Still building, Not available)

#### Project building(Still building, Not available)

<br />

### Tech Stack 🧰 <a name="tech-stack"></a>

* Frontend: Next.js(React) + Typescript + Slate
* Backend: Node.js + Egg.js + Prisma + MySQL
* Deploy: Docker
* Cloud Service Provider: DigitalOcean

### Run it Locally 👏🏻 <a name="run"></a>

If you desire to host QuizMe independently or create your own version of QuizMe, you could follow these steps.

The frontend and backend are both within the same repository.

#### Prerequisites

Make sure you've already installed Docker and Node.js(>=16.20.0)

#### Configure the development variable
```bash
// Create .dev.env directly under the backend directory
DATABASE_URL=xxx
// Image Bucket
AWS_ACCESS_KEY=xxx
AWS_ACCESS_SECRET=xxx
AWS_REGION=xxx
AWS_IMAGE_BUCKET=xxx
```

#### Run the database Docker container

```bash
docker run -itd --name quizme-db -p <port>:<port> -e MYSQL_ROOT_PASSWORD=<password> -v <db-directory>:/var/lib/mysql mysql
```

#### Install backend dependencies

```bash
cd backend
npm ci
```

#### Migrate prisma schema to database and run the Node.js server

```bash
cd backend
npm run migrate:dev
npm run dev
```

#### Run the frontend
After running this script, it will be served at http://localhost:3000.
```bash
cd frontend
npm run dev
```
Rich text editor is hiden by default. You have to set the variable to enable this feature: 
```bash
localStorage.setItem('QUIZ_ME_ENABLE_WRITE', 1);
```

### Blogs 🚀 <a name="blogs"></a>

I'll share the important technical details, decision-making processes and solutions in building QuizMe. Hope it'll inspire you. Have a look:

- [How To Reduce Docker Image Size by 81%](https://medium.com/better-programming/how-to-reduce-docker-image-size-by-81-frontend-next-js-practice-8680bda50fee)



QuizMe is [MIT-licensed](./License).