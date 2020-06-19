<template>
  <div>
    <el-menu
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.4)"
      :default-active="sidebar"
      class="el-menu-vertical menu"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <NavMenu :navMenus="leftMenus" :class="[loading ? 'hidden': 'show']" style="font-size:19px;"></NavMenu>
    </el-menu>
  </div>
</template>

<script>
import NavMenu from "~/components/menu/Menu.vue";
import axios from "~/plugins/axios2";
export default {
  components: {
    NavMenu
  },
  data() {
    return {
      sidebar: (this.$route.hash && this.$route.hash.split("#")[1]) || null,
      loading: true,
      leftMenus: [
        {
          entity: {
            id: 1,
            name: "index",
            alias: "首页",
            state: "ENABLE",
            value: "/"
          }
        },
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
            // {
            //   entity: {
            //     id: 3,
            //     name: "administrator",
            //     alias: "管理员",
            //     state: "ENABLE",
            //     value: "/system/administrator"
            //   }
            // },
            {
              entity: {
                id: 4,
                name: "department",
                alias: "部门",
                state: "ENABLE",
                value: "/system/department"
              }
            },
            // {
            //   entity: {
            //     id: 5,
            //     name: "teacher",
            //     alias: "用户管理",
            //     state: "ENABLE",
            //     value: "/system/teacher"
            //   }
            // },
            {
              entity: {
                id: 5,
                name: "teacherInfo",
                alias: "教职工信息",
                state: "ENABLE",
                value: "/system/teacherInfo"
              }
            },
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
                    alias: "科研获奖",
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
                alias: "获奖",
                state: "ENABLE",
                value: "/reward/presentation"
              }
            },
            {
              entity: {
                id: 60,
                name: "report",
                alias: "要报",
                state: "ENABLE",
                value: "/reward/report"
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
                id: 61,
                name: "transverse",
                alias: "横向课题",
                state: "ENABLE",
                value: "/reward/transverse"
              }
            },
            {
              entity: {
                id: 62,
                name: "participants",
                alias: "教师参会情况",
                state: "ENABLE",
                value: "/reward/participants"
              }
            },
            // {
            //   entity: {
            //     id: 63,
            //     name: "thesis",
            //     alias: "优秀硕博论文",
            //     state: "ENABLE",
            //     value: "/reward/thesis"
            //   }
            // },
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
                id: 46,
                name: "undergraduates",
                alias: "本科生模块",
                state: "ENABLE",
                value: ""
              },
              childs: [
                // {
                //   entity: {
                //     id: 47,
                //     name: "undergraduatesTeaching",
                //     alias: "本科生教学",
                //     state: "ENABLE",
                //     value: "/database/undergraduates/teaching"
                //   }
                // },
                {
                  entity: {
                    id: 48,
                    name: "undergraduatesRecruit",
                    alias: "本科生招生",
                    state: "ENABLE",
                    value: "/database/undergraduates/recruit"
                  }
                },
                {
                  entity: {
                    id: 49,
                    name: "undergraduatesGraduation",
                    alias: "本科生毕业",
                    state: "ENABLE",
                    value: "/database/undergraduates/graduation"
                  }
                },
                {
                  entity: {
                    id: 90,
                    name: "advantage",
                    alias: "优势专业情况",
                    state: "ENABLE",
                    value: "/database/undergraduates/advantage"
                  }
                },
                {
                  entity: {
                    id: 91,
                    name: "construction",
                    alias: "本科教学工程情况",
                    state: "ENABLE",
                    value: "/database/undergraduates/construction"
                  }
                },
                {
                  entity: {
                    id: 92,
                    name: "information",
                    alias: "本科教学信息化",
                    state: "ENABLE",
                    value: "/database/undergraduates/information"
                  }
                },
                {
                  entity: {
                    id: 93,
                    name: "undergraduatesPatent",
                    alias: "教师专利",
                    state: "ENABLE",
                    value: "/database/undergraduates/patent"
                  }
                },
                {
                  entity: {
                    id: 94,
                    name: "basic",
                    alias: "专业基本情况",
                    state: "ENABLE",
                    value: "/database/undergraduates/basic"
                  }
                }
              ]
            },
            {
              entity: {
                id: 50,
                name: "postgraduate",
                alias: "研究生模块",
                state: "ENABLE",
                value: "/database/postgraduate"
              },
              childs: [
                {
                  entity: {
                    id: 51,
                    name: "postgraduateTeaching",
                    alias: "研究生教学",
                    state: "ENABLE",
                    value: "/database/postgraduate/teaching"
                  }
                },
                {
                  entity: {
                    id: 52,
                    name: "postgraduateRecruit",
                    alias: "研究生招生",
                    state: "ENABLE",
                    value: "/database/postgraduate/recruit"
                  }
                },
                {
                  entity: {
                    id: 53,
                    name: "postgraduateGraduation",
                    alias: "研究生毕业",
                    state: "ENABLE",
                    value: "/database/postgraduate/graduation"
                  }
                }
              ]
            },
            {
              entity: {
                id: 54,
                name: "doctors",
                alias: "博士生模块",
                state: "ENABLE",
                value: "/database/doctors"
              },
              childs: [
                {
                  entity: {
                    id: 55,
                    name: "doctorsTeaching",
                    alias: "博士生教学",
                    state: "ENABLE",
                    value: "/database/doctors/teaching"
                  }
                },
                {
                  entity: {
                    id: 56,
                    name: "doctorsRecruit",
                    alias: "博士生招生",
                    state: "ENABLE",
                    value: "/database/doctors/recruit"
                  }
                },
                {
                  entity: {
                    id: 57,
                    name: "doctorsGraduation",
                    alias: "博士生毕业",
                    state: "ENABLE",
                    value: "/database/doctors/graduation"
                  }
                }
              ]
            },

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
                id: 63,
                name: "undergraduate",
                alias: "本科招生情况",
                state: "ENABLE",
                value: "/database/undergraduate"
              }
            },
            // {
            //   entity: {
            //     id: 64,
            //     name: "MBAecruit",
            //     alias: "MBA/EMBA招生情况",
            //     state: "ENABLE",
            //     value: "/database/MBAecruit"
            //   }
            // },
            {
              entity: {
                id: 37,
                name: "abroad",
                alias: "留学生信息",
                state: "ENABLE",
                value: "/database/abroad"
              }
            },

            // {
            //   entity: {
            //     id: 64,
            //     name: "undergraduateGraduation",
            //     alias: "本科毕业情况",
            //     state: "ENABLE",
            //     value: "/database/undergraduateGraduation"
            //   }
            // },
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
                id: 38,
                name: "masterGraduation",
                alias: "学硕毕业情况",
                state: "ENABLE",
                value: "/database/masterGraduation"
              }
            },
            // {
            //   entity: {
            //     id: 58,
            //     name: "assistantAdmission",
            //     alias: "专硕招生情况",
            //     state: "ENABLE",
            //     value: "/database/assistantAdmission"
            //   }
            // },
            // {
            //   entity: {
            //     id: 59,
            //     name: "assistantGraduation",
            //     alias: "专硕毕业情况",
            //     state: "ENABLE",
            //     value: "/database/assistantGraduation"
            //   }
            // },
            {
              entity: {
                id: 40,
                name: "innovate",
                alias: "教师教改项目",
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
            // {
            //   entity: {
            //     id: 43,
            //     name: "disciplineConstruction",
            //     alias: "就业指导",
            //     state: "ENABLE",
            //     value: "/database/disciplineConstruction"
            //   }
            // },
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
            },
            {
              entity: {
                id: 81,
                name: "competition",
                alias: "学生竞赛奖励",
                state: "ENABLE",
                value: "/database/competition"
              }
            },
            {
              entity: {
                id: 82,
                name: "entrepreneurship",
                alias: "学生创新创业训练计划项目情况",
                state: "ENABLE",
                value: "/database/entrepreneurship"
              }
            },
            {
              entity: {
                id: 83,
                name: "academicPaper",
                alias: "学生发表学术论文情况",
                state: "ENABLE",
                value: "/database/academicPaper"
              }
            },
            {
              entity: {
                id: 84,
                name: "patent",
                alias: "学生获得专利（软件著作权）情况",
                state: "ENABLE",
                value: "/database/patent"
              }
            },
            {
              entity: {
                id: 85,
                name: "honor",
                alias: "学生个人荣誉称号",
                state: "ENABLE",
                value: "/database/honor"
              }
            },
            {
              entity: {
                id: 86,
                name: "course",
                alias: "学生学科信息",
                state: "ENABLE",
                value: "/database/course"
              }
            },
            {
              entity: {
                id: 87,
                name: "member",
                alias: "学生党员情况",
                state: "ENABLE",
                value: "/database/member"
              }
            },
            {
              entity: {
                id: 88,
                name: "graduate",
                alias: "毕业生",
                state: "ENABLE",
                value: "/database/graduate"
              }
            },
            {
              entity: {
                id: 89,
                name: "overseas",
                alias: "商学院出国学生",
                state: "ENABLE",
                value: "/database/overseas"
              }
            }
          ]
        },
        {
          entity: {
            id: 77,
            name: "academicExchange",
            alias: "MBA系统建设",
            state: "",
            value: "/database/academicExchange"
          },
          childs: [
            {
              entity: {
                id: 64,
                name: "InputStudent",
                alias: "招生信息 ",
                state: "ENABLE",
                value: "/MBA/InputStudent"
              }
            },
            {
              entity: {
                id: 65,
                name: "studentInfo",
                alias: "学生具体信息 ",
                state: "ENABLE",
                value: "/MBA/studentInfo"
              }
            },
            {
              entity: {
                id: 66,
                name: "staffInfo",
                alias: "教师职工信息 ",
                state: "ENABLE",
                value: "/MBA/staffInfo"
              }
            },
            {
              entity: {
                id: 67,
                name: "teacherPaper",
                alias: "教师期刊论文管理 ",
                state: "ENABLE",
                value: "/MBA/teacherPaper"
              }
            },
            {
              entity: {
                id: 68,
                name: "teacherSeminar",
                alias: "教师学术议会管理 ",
                state: "ENABLE",
                value: "/MBA/teacherSeminar"
              }
            },
            {
              entity: {
                id: 69,
                name: "portraitScientificResearch",
                alias: "教师纵向科研信息 ",
                state: "ENABLE",
                value: "/MBA/portraitScientificResearch"
              }
            },
            {
              entity: {
                id: 70,
                name: "transverseScientificResearch",
                alias: "教师横向科研信息 ",
                state: "ENABLE",
                value: "/MBA/transverseScientificResearch"
              }
            },
            {
              entity: {
                id: 71,
                name: "researchFunds",
                alias: "进校科研经费 ",
                state: "ENABLE",
                value: "/MBA/researchFunds"
              }
            },
            {
              entity: {
                id: 72,
                name: "academicWorks",
                alias: "出版学术著作教材信息",
                state: "ENABLE",
                value: "/MBA/academicWorks"
              }
            },
            {
              entity: {
                id: 73,
                name: "prizeWinning",
                alias: "教师负责人成果获奖信息",
                state: "ENABLE",
                value: "/MBA/prizeWinning"
              }
            },
            {
              entity: {
                id: 74,
                name: "partTimeJobTeacher",
                alias: "兼职教师信息",
                state: "ENABLE",
                value: "/MBA/partTimeJobTeacher"
              }
            },
            {
              entity: {
                id: 75,
                name: "postgraduateClass",
                alias: "研究生课堂教学",
                state: "ENABLE",
                value: "/MBA/postgraduateClass"
              }
            },
            {
              entity: {
                id: 76,
                name: "postgraduatePaper",
                alias: "研究生论文指导",
                state: "ENABLE",
                value: "/MBA/postgraduatePaper"
              }
            }
          ]
        }
      ]
    };
  },
  methods: {
    // 生成用户权限树
    async initTree() {
      this.loading = true;
      let roleId = window.localStorage.getItem("roleId");
      // 查询用户权限树
      let result = await axios.$get("/menu/checkedMenuListByRoleId", {
        roleId
      });
      let roleIds = result.data;
      function ergodic(tree) {
        let count = 0;
        for (let i = 0; i < tree.length; i++) {
          if (roleIds.includes(tree[i].entity.id)) {
            tree[i].entity.state = "ENABLE";
            count++;
          } else {
            tree[i].entity.state = "";
          }
          if (tree[i].childs && tree[i].childs.length > 0) {
            let childCount = ergodic(tree[i].childs);
            if (childCount > 0) {
              tree[i].entity.state = "ENABLE";
            }
          }
        }
        return count;
      }
      ergodic(this.leftMenus);
      this.loading = false;
    }
  },
  mounted() {
    this.initTree();
  },
  computed: {
    roles() {
      return this.$store.state.roles;
    }
  },
  watch: {
    roles(newVal, oldVal) {
      this.initTree();
    }
  }
};
</script>

<style>
.el-menu-vertical {
  height: 1000px;
  overflow-y: auto;
}
.el-menu-vertical::-webkit-scrollbar {
  display: none; /*隐藏滚动条*/
}

.meun {
  overflow: hidden;
}
.show {
  display: block;
}
.hidden {
  display: none;
}
</style>
