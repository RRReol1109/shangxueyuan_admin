let tree = [
  {
    entity: {
      id: 1,
      name: "systemManegement",
      alias: "系统管理",
      state: "ENABLE",
      value: "/system"
    },
    childs: [
      {
        entity: {
          id: 2,
          name: "role",
          alias: "角色",
          state: "ENABLE",
          value: "/system/role"
        }
      },
      {
        entity: {
          id: 3,
          name: "administrator",
          alias: "管理员",
          state: "ENABLE",
          value: "/system/administrator"
        }
      },
      {
        entity: {
          id: 4,
          name: "department",
          alias: "部门",
          state: "ENABLE",
          value: "/system/department"
        }
      },
      {
        entity: {
          id: 5,
          name: "teacher",
          alias: "用户管理",
          state: "ENABLE",
          value: "/system/teacher"
        }
      },
      // {
      //   entity: {
      //     id: 6,
      //     name: "paperGrade",
      //     alias: "论文等级",
      //     state: "ENABLE",
      //     value: "/system/paperGrade"
      //   }
      // },
      {
        entity: {
          id: 7,
          name: "classHourRule",
          alias: "学时规则",
          state: "ENABLE",
          value: "/system/classHourRule"
        }
      },
      {
        entity: {
          id: 8,
          name: "scoreRule",
          alias: "分数规则",
          state: "ENABLE",
          value: "/system/scoreRule"
        },
        childs: [
          {
            entity: {
              id: 9,
              name: "scientificEstablish",
              alias: "科研立项",
              state: "ENABLE",
              value: "/system/score/scientific/establish"
            }
          },
          {
            entity: {
              id: 10,
              name: "teacherAchievement",
              alias: "科研成果",
              state: "ENABLE",
              value: "/system/score/scientific/achievement"
            }
          },
          {
            entity: {
              id: 6,
              name: "paperGrade",
              alias: "论文等级",
              state: "ENABLE",
              value: "/system/paperGrade"
            }
          },
          // {
          //   entity: {
          //     name: "paper",
          //     alias: "论文",
          //     state: "ENABLE",
          //     value: "/system/score/paper"
          //   }
          // },
          {
            entity: {
              id: 11,
              name: "book",
              alias: "著作&教材",
              state: "ENABLE",
              value: "/system/score/book"
            }
          }
        ]
      },
      {
        entity: {
          id: 12,
          name: "log",
          alias: "日志",
          state: "ENABLE",
          value: "/system/log"
        }
      }
    ]
  },
  {
    entity: {
      id: 13,
      name: "workloadManegement",
      alias: "工作量管理",
      state: "ENABLE",
      value: "/workload"
    },
    childs: [
      {
        entity: {
          id: 14,
          name: "paper",
          alias: "论文指导",
          state: "ENABLE",
          value: "/workload/paper"
        }
      },
      {
        entity: {
          id: 15,
          name: "guidance",
          alias: "研究生指导",
          state: "ENABLE",
          value: "/workload/guidance"
        }
      },
      {
        entity: {
          id: 16,
          name: "classTeach",
          alias: "课堂教学",
          state: "ENABLE",
          value: "/workload/classTeach"
        }
      },
      {
        entity: {
          id: 17,
          name: "internship",
          alias: "实习",
          state: "ENABLE",
          value: "/workload/internship"
        }
      },
      {
        entity: {
          id: 18,
          name: "sandTable",
          alias: "沙盘模拟",
          state: "ENABLE",
          value: "/workload/sandTable"
        }
      },
      {
        entity: {
          id: 19,
          name: "socialSurvey",
          alias: "社会调查",
          state: "ENABLE",
          value: "/workload/socialSurvey"
        }
      },
      {
        entity: {
          id: 20,
          name: "workloadStatistics",
          alias: "统计",
          state: "ENABLE",
          value: "/workload/statistics"
        }
      }
    ]
  },
  {
    entity: {
      id: 21,
      name: "rewardManegement",
      alias: "科研奖励管理",
      state: "ENABLE",
      value: "/reward"
    },
    childs: [
      {
        entity: {
          id: 22,
          name: "opus",
          alias: "著作&教材",
          state: "ENABLE",
          value: "/reward/opus"
        }
      },
      {
        entity: {
          id: 23,
          name: "paperCn",
          alias: "中文论文",
          state: "ENABLE",
          value: "/reward/paperCn"
        }
      },
      {
        entity: {
          id: 24,
          name: "paperEu",
          alias: "英文论文",
          state: "ENABLE",
          value: "/reward/paperEu"
        }
      },
      {
        entity: {
          id: 25,
          name: "presentation",
          alias: "获奖&要报",
          state: "ENABLE",
          value: "/reward/presentation"
        }
      },
      {
        entity: {
          id: 26,
          name: "thesis",
          alias: "优秀硕博论文",
          state: "ENABLE",
          value: "/reward/thesis"
        }
      },
      {
        entity: {
          id: 27,
          name: "research",
          alias: "科研项目",
          state: "ENABLE",
          value: "/reward/research"
        }
      },
      {
        entity: {
          id: 28,
          name: "rewardStatistics",
          alias: "统计",
          state: "ENABLE",
          value: "/reward/statistics"
        }
      }
    ]
  },
  {
    entity: {
      id: 29,
      name: "database",
      alias: "数据库",
      state: "ENABLE",
      value: "/database"
    },
    childs: [
      {
        entity: {
          id: 30,
          name: "studentAbroad",
          alias: "出国学生",
          state: "ENABLE",
          value: "/database/studentAbroad"
        }
      },
      {
        entity: {
          id: 31,
          name: "academicExchange",
          alias: "学术交流",
          state: "ENABLE",
          value: "/database/academicExchange"
        }
      },
      {
        entity: {
          id: 32,
          name: "disciplineBrief",
          alias: "学科点简况",
          state: "ENABLE",
          value: "/database/disciplineBrief"
        }
      },
      {
        entity: {
          id: 33,
          name: "specialAssistant",
          alias: "专硕名单",
          state: "ENABLE",
          value: "/database/specialAssistant"
        }
      },
      {
        entity: {
          id: 34,
          name: "maillist",
          alias: "通讯录",
          state: "ENABLE",
          value: "/database/maillist"
        }
      },
      {
        entity: {
          id: 35,
          name: "disciplineConstruction",
          alias: "学科建设",
          state: "ENABLE",
          value: "/database/disciplineConstruction"
        }
      },
      {
        entity: {
          id: 36,
          name: "doctor",
          alias: "博士生招生情况",
          state: "ENABLE",
          value: "/database/doctor"
        }
      },
      {
        entity: {
          id: 37,
          name: "abroad",
          alias: "留学生信息",
          state: "ENABLE",
          value: "/database/abroad"
        }
      },
      {
        entity: {
          id: 38,
          name: "masterGraduation",
          alias: "学硕毕业情况",
          state: "ENABLE",
          value: "/database/masterGraduation"
        }
      },
      {
        entity: {
          id: 39,
          name: "masterAdmission",
          alias: "学硕招生情况",
          state: "ENABLE",
          value: "/database/masterAdmission"
        }
      },
      {
        entity: {
          id: 40,
          name: "innovate",
          alias: "研究生教改项目",
          state: "ENABLE",
          value: "/database/innovate"
        }
      },
      {
        entity: {
          id: 41,
          name: "excellentGraduation",
          alias: "优秀毕业生简况",
          state: "ENABLE",
          value: "/database/excellentGraduation"
        }
      },
      {
        entity: {
          id: 42,
          name: "graduationRate",
          alias: "毕业率",
          state: "ENABLE",
          value: "/database/graduationRate"
        }
      },
      {
        entity: {
          id: 43,
          name: "disciplineConstruction",
          alias: "就业指导",
          state: "ENABLE",
          value: "/database/disciplineConstruction"
        }
      },
      {
        entity: {
          id: 44,
          name: "subject",
          alias: "三学科人员",
          state: "ENABLE",
          value: "/database/subject"
        }
      },
      {
        entity: {
          id: 45,
          name: "active",
          alias: "活动规划",
          state: "ENABLE",
          value: "/database/active"
        }
      }
    ]
  },
  {
    entity: {
      id: 46,
      name: "academicExchange",
      alias: "MBA系统建设",
      state: "ENABLE",
      value: "/database/academicExchange"
    },
    childs: [
      {
        entity: {
          id: 47,
          name: "InputStudent",
          alias: "招生信息 ",
          state: "ENABLE",
          value: "/MBA/InputStudent"
        }
      },
      {
        entity: {
          id: 48,
          name: "studentInfo",
          alias: "学生具体信息 ",
          state: "ENABLE",
          value: "/MBA/studentInfo"
        }
      },
      {
        entity: {
          id: 49,
          name: "staffInfo",
          alias: "教师职工信息 ",
          state: "ENABLE",
          value: "/MBA/staffInfo"
        }
      },
      {
        entity: {
          id: 50,
          name: "teacherPaper",
          alias: "教师期刊论文管理 ",
          state: "ENABLE",
          value: "/MBA/teacherPaper"
        }
      },
      {
        entity: {
          id: 51,
          name: "teacherSeminar",
          alias: "教师学术议会管理 ",
          state: "ENABLE",
          value: "/MBA/teacherSeminar"
        }
      },
      {
        entity: {
          id: 52,
          name: "portraitScientificResearch",
          alias: "教师纵向科研信息 ",
          state: "ENABLE",
          value: "/MBA/portraitScientificResearch"
        }
      },
      {
        entity: {
          id: 53,
          name: "transverseScientificResearch",
          alias: "教师横向科研信息 ",
          state: "ENABLE",
          value: "/MBA/transverseScientificResearch"
        }
      },
      {
        entity: {
          id: 54,
          name: "researchFunds",
          alias: "进校科研经费 ",
          state: "ENABLE",
          value: "/MBA/researchFunds"
        }
      },
      {
        entity: {
          id: 55,
          name: "academicWorks",
          alias: "教师主编出版学术著作教材信息",
          state: "ENABLE",
          value: "/MBA/academicWorks"
        }
      },
      {
        entity: {
          id: 56,
          name: "prizeWinning",
          alias: "教师负责人成果获奖信息",
          state: "ENABLE",
          value: "/MBA/prizeWinning"
        }
      },
      {
        entity: {
          id: 57,
          name: "partTimeJobTeacher",
          alias: "兼职教师信息",
          state: "ENABLE",
          value: "/MBA/partTimeJobTeacher"
        }
      },
      {
        entity: {
          id: 58,
          name: "postgraduateClass.",
          alias: "研究生课堂教学",
          state: "ENABLE",
          value: "/MBA/postgraduateClass."
        }
      },
      {
        entity: {
          id: 59,
          name: "postgraduatePaper.",
          alias: "研究生论文指导",
          state: "ENABLE",
          value: "/MBA/postgraduatePaper."
        }
      }
    ]
  }
];

let roles = [2,3,4];
function ergodic(tree) {
  let count = 0;
  for(let i=0; i<tree.length; i++) {
    if(roles.includes(tree[i].entity.id)) {
      console.log('id',tree[i].entity.id);
      console.log('alias',tree[i].entity.alias);
      tree[i].entity.state = "ENABLE";
      count ++;
    } else {
      tree[i].entity.state = "";
    }
    if(tree[i].childs && tree[i].childs.length > 0) {
      let childCount = ergodic(tree[i].childs);
      if(childCount > 0) {
        tree[i].entity.state = "ENABLE";
      }
    }
  }
  return count;
}

let a = ergodic(tree);
console.log('AAA:', JSON.stringify(tree));