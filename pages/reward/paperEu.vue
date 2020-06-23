<template>
  <div>
    <div class="search-form">
      <el-form :inline="true" :model="query">
        <el-form-item label="论文名称:">
          <el-input v-model="query.title" placeholder size="normal"></el-input>
        </el-form-item>
        <el-form-item label="DOI号:">
          <el-input v-model="query.doi" placeholder size="normal"></el-input>
        </el-form-item>
        <!-- <el-form-item label="期刊分级:">
          <el-select v-model="query.level" size="normal" placeholder="请选择分级">
            <el-option label="全部" value></el-option>
            <el-option label="英文A+" value="A+"></el-option>
            <el-option label="英文A" value="A"></el-option>
            <el-option label="英文A-" value="A-"></el-option>
            <el-option label="英文B+" value="B+"></el-option>
            <el-option label="英文B" value="B"></el-option>
            <el-option label="英文B-" value="B-"></el-option>
            <el-option label="英文C+" value="C+"></el-option>
            <el-option label="英文C" value="C"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="期刊名称:">
          <el-input v-model="query.journal" placeholder size="normal"></el-input>
        </el-form-item>
        <!-- <el-form-item label="通讯作者姓名:">
          <el-input v-model="query.coauthorName" placeholder="请输入通讯作者姓名"></el-input>
        </el-form-item>
        <el-form-item label="通讯作者单位:">
          <el-input v-model="query.coauthorName" placeholder="请输入作者单位"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="半价/原价:">
          <el-select v-model="query.half" size="normal" placeholder="请选择">
            <el-option label="全部" value></el-option>
            <el-option label="半价" value="1"></el-option>
            <el-option label="原价" value="0"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="list">查询</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button
            size="normal"
            type="primary"
            icon="el-icon-plus"
            @click="operate = 'add';showDialog();"
          >新增</el-button>
        </el-form-item>
        <el-form-item label>
          <el-button size="normal" type="primary" icon="el-icon-search" @click="downLoad">计算规则</el-button>
        </el-form-item>
        <el-form-item>
          <el-dropdown @command="handleCommand" style="float:right;">
            <el-button size="normal" type="primary">
              功能列表
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="temp">模板下载</el-dropdown-item>
              <el-dropdown-item command="download">导出数据</el-dropdown-item>
              <el-dropdown-item command="delCount">批量删除</el-dropdown-item>
              <el-dropdown-item command="examine">批量审核</el-dropdown-item>
              <el-dropdown-item>
                <el-upload
                  class
                  :show-file-list="false"
                  :file-list="fileList"
                  :headers="header"
                  :on-success="uploadSuccess"
                  action="http://bs.hk.darkal.cn/articleEn/upload?token='AuthenticationToken'"
                >
                  <el-button size="normal" class type="text">批量上传</el-button>
                </el-upload>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>
        <!-- <el-form-item label="附件" prop="file">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="fileUploadSuccess"
            action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="normal" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>-->
      </el-form>
    </div>
    <el-table :data="tableData" border style="width: 100%" v-loading="loading">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="pick"
        align="center"
        label="选择"
        width="50"
      >
        <template slot-scope="scope">
          <el-checkbox @change="changeFlag(scope.row)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        type="index"
        label="序号"
        align="center"
        width="50"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="year"
        align="center"
        label="发表日期"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="reformPaper"
        align="center"
        label="是否为教改论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.reformPaper | flagFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="title"
        align="center"
        label="论文名称"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="journal"
        align="center"
        label="期刊名称"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="doi"
        align="center"
        label="DOI号"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="wos"
        align="center"
        label="WoS号"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="subsidizeSource"
        align="center"
        label="资助来源"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="collegeLevel"
        align="center"
        label="学院期刊分级"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="issn"
        align="center"
        label="期刊ISSN号"
      ></el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="half" align="center" label="原价/半价"></el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="score" align="center" label="计分"></el-table-column>-->
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="highlyCited"
        align="center"
        label="ESI经济"
      ></el-table-column>-->
      <!-- <el-table-column :show-overflow-tooltip="true" prop="coauthorName" align="center" label="通讯作者单位"></el-table-column> -->
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="included"
        align="center"
        label="核心收录"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="subject"
        align="center"
        label="期刊所属学科"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="schoolLevel"
        align="center"
        label="学校期刊分级"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="firstAuthor"
        align="center"
        label="第一作者"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="firstAuthorDept"
        align="center"
        label="第一作者单位"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="firstCorrespondent"
        align="center"
        label="第一通讯作者"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="firstCorrespondentDept"
        align="center"
        label="第一通讯作者单位"
      ></el-table-column>
      <el-table-column
        width="180"
        :show-overflow-tooltip="true"
        prop="esiEconomics"
        align="center"
        label="是否ESI经济学商学论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.esiEconomics | flagFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="esi1"
        align="center"
        label="ESI高被引1%(百分之一)"
      >
        <template slot-scope="scope">
          <span>{{scope.row.esiEconomics | flagFilter}}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        width="180"
        :show-overflow-tooltip="true"
        prop="esi1Date"
        align="center"
        label="进入1%(百分之一)时间"
      ></el-table-column>
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        prop="esi01"
        align="center"
        label="ESI高被引0.1%(千分之一)"
      >
        <template slot-scope="scope">
          <span>{{scope.row.esiEconomics | flagFilter}}</span>
        </template>
      </el-table-column>-->
      <el-table-column
        width="180"
        :show-overflow-tooltip="true"
        prop="esi01Date"
        align="center"
        label="进入0.1%(千分之一)时间"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="yearDate"
        align="center"
        label="年代卷期"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="timesCited"
        align="center"
        label="被引用次数"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="jcrLevel1"
        align="center"
        label="汤森路透JCR分区"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="jcrLevel2"
        align="center"
        label="中科院JCR分区"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="ft50"
        align="center"
        label="金融时报FT50"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="abs"
        align="center"
        label="ABS"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="utd24"
        align="center"
        label="UTD24"
      ></el-table-column>
      <el-table-column
        width="150"
        :show-overflow-tooltip="true"
        prop="cooPaper"
        align="center"
        label="是否国际合作论文"
      >
        <template slot-scope="scope">
          <span>{{scope.row.cooPaper | flagFilter}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip="true" prop="cateNumber" align="center" label="分类编号"></el-table-column> -->
      <el-table-column :show-overflow-tooltip="true" prop="auditFlag" align="center" label="审核状态">
        <template slot-scope="scope">
          <span style="color:#409EFF">{{scope.row.auditFlag | statusFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="300">
        <template slot-scope="scope">
          <el-button @click="operate='show';showDialog(scope.row)" type="text">查看</el-button>
          <el-button @click="operate='edit';showDialog(scope.row)" type="text">编辑</el-button>
          <el-button @click="del(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <nav style="text-align: center; margin-top: 10px;">
      <!-- 分页居中放置-->
      <el-pagination
        background
        :page-size="15"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        @next-click="handleCurrentChange"
        @prev-click="handleCurrentChange"
        @size-change="handleCurrentChange"
        :current-page.sync="page"
        :total="total"
      ></el-pagination>
    </nav>
    <el-dialog width="35%" style="min-height:500px" title="批量审核操作" :visible.sync="examineDialog">
      <el-row>
        <el-col :span="8">
          <el-button @click="examineDialog = false" size="normal" style="width:97%;">取 消</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="primary"
            @click="examineData('success')"
            size="normal"
            style="width:97%;"
          >通过</el-button>
        </el-col>
        <el-col :span="8">
          <el-button
            type="danger"
            @click="examineData('failed')"
            size="normal"
            style="width:97%;"
          >不通过</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-drawer size="60%" style="min-height:500px" title :visible.sync="dialogFormVisible">
      <div slot="title" class="header-title">
        <div v-if="['edit', 'add'].includes(operate)" style="margin-left: 20px;">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button size="normal" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="180px"
        class="demo-ruleForm"
        size="normal"
        :disabled="!['edit', 'add'].includes(operate)"
      >
        <el-divider content-position="left">基本信息</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="发表日期:" prop="contractno">
              <el-date-picker
                size="normal"
                style="width:98%"
                v-model="ruleForm.year"
                type="year"
                format="yyyy"
                value-format="yyyy"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否为教改论文" prop="reformPaper">
              <el-select placeholder="请选择" style="width:98%" v-model="ruleForm.reformPaper">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="论文名称:" prop="contracttype">
          <el-input learable v-model="ruleForm.title" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="期刊名称" prop="journal">
          <el-input v-model="ruleForm.journal" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="期刊ISSN号" prop="issn">
          <el-input clearable v-model="ruleForm.issn" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-form-item label="资助课题来源" prop="subsidizeSource">
          <el-input learable v-model="ruleForm.subsidizeSource" placeholder style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="核心收录" prop="included">
              <el-select placeholder="请选择" style="width:98%" v-model="ruleForm.included">
                <el-option label="CSTPCD" value="CSTPCD"></el-option>
                <el-option label="CSCD扩展" value="CSCD扩展"></el-option>
                <el-option label="CSSCI核心" value="CSSCI核心"></el-option>
                <el-option label="北大核心" value="北大核心"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="期刊所属学科" prop="subject">
              <el-input learable placeholder style="width:99%" v-model="ruleForm.subject"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="WoS号" prop="wos">
              <el-input v-model="ruleForm.wos" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="DOI号" prop="doi">
              <el-input learable v-model="ruleForm.doi" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="学校期刊分级" prop="schoolLevel">
              <el-input learable v-model="ruleForm.schoolLevel" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="学院期刊分级" prop="collegeLevel">
              <el-select v-model="ruleForm.collegeLevel" placeholder="请选择级别" style="width:98%">
                <el-option label="英文A+" value="A+"></el-option>
                <el-option label="英文A" value="A"></el-option>
                <el-option label="英文A-" value="A-"></el-option>
                <el-option label="英文B+" value="B+"></el-option>
                <el-option label="英文B" value="B"></el-option>
                <el-option label="英文B-" value="B-"></el-option>
                <el-option label="英文C+" value="C+"></el-option>
                <el-option label="英文C" value="C"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label prop="esiEconomics">
              <el-checkbox v-model="ruleForm.esiEconomics">是否ESI经济学商学论文</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label prop="esi1">
              <el-checkbox v-model="ruleForm.esi1">ESI高被引 1%（百分之一）</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进入1%时间" prop>
              <el-date-picker
                style="width:98%"
                size="normal"
                v-model="ruleForm.esi1Date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label prop="esi01">
              <el-checkbox v-model="ruleForm.esi01">ESI高被引 0.1%（千分之一）</el-checkbox>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="进入0.1%时间" prop>
              <el-date-picker
                style="width:98%"
                size="normal"
                v-model="ruleForm.esi01Date"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年代卷期" prop="yearDate">
              <el-input placeholder style="width:98%" v-model="ruleForm.yearDate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="汤森路透JCR分区" prop="jcrLevel1">
              <el-select placeholder="请选择级别" v-model="ruleForm.jcrLevel1" style="width:98%">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="被引用次数" prop="timesCited">
              <el-input placeholder style="width:98%" v-model="ruleForm.timesCited"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="中科院JCR分区" prop>
              <el-select placeholder="请选择级别" v-model="ruleForm.jcrLevel2" style="width:98%">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label prop></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="金融时报FT50" prop="ft50">
              <el-select placeholder="请选择" v-model="ruleForm.ft50" style="width:98%">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label prop></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="ABS" prop="abs">
              <el-select placeholder="请选择" v-model="ruleForm.abs" style="width:98%">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
                <el-option label="4*" value="4*"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label prop></el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="UTD24" prop="utd24">
              <el-select placeholder="请选择" v-model="ruleForm.utd24" style="width:98%">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否国际合作论文" prop="cooPaper">
              <el-select placeholder="请选择" v-model="ruleForm.cooPaper" style="width:98%">
                <el-option label="是" value="true"></el-option>
                <el-option label="否" value="false"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          v-if="ruleForm.isnationalitycooperation == '是'"
          label="合作人信息"
          prop="cooAuthor"
        >
          <el-input clearable v-model="ruleForm.cooAuthor" placeholder="请输入内容" style="width:99%"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="第一作者" prop="firstAuthor">
              <el-input clearable v-model="ruleForm.firstAuthor" placeholder style="width:98%"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第一作者单位" prop="firstAuthorDept">
          <el-input
            type="textarea"
            clearable
            v-model="ruleForm.firstAuthorDept"
            placeholder
            style="width:99%"
          ></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="第一通讯作者" prop="firstCorrespondent">
              <el-input
                clearable
                v-model="ruleForm.firstCorrespondent"
                placeholder
                style="width:99%"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="第一通讯作者单位" prop="firstCorrespondentDept">
          <el-input
            type="textarea"
            clearable
            v-model="ruleForm.firstCorrespondentDept"
            placeholder
            style="width:99%"
          ></el-input>
        </el-form-item>
        <el-form-item label="全体作者" prop="authors">
          <el-input
            type="textarea"
            clearable
            v-model="ruleForm.authors"
            placeholder="张三，李四_外单位，王五_张三"
            style="width:99%"
          ></el-input>
          <span style="color:#F56C6C">注：以上示例中王五是张三的学生</span>
        </el-form-item>
        <!-- <el-form-item label="论文研究领域" prop="level">
          <el-col :span="12">
            <el-select v-model="ruleForm.level" placeholder="论文研究领域">
              <el-option label="基础理论研究" value="基础理论研究"></el-option>
              <el-option label="应用研究" value="应用研究"></el-option>
              <el-option label="教学研究" value="教学研究"></el-option>
            </el-select>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="原/半价" prop="half">
          <el-col :span="12">
            <el-select v-model="ruleForm.half" placeholder="请选择类型">
              <el-option label="原价" value="0"></el-option>
              <el-option label="半价" value="1"></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="计分" prop="score">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.score" placeholder=""></el-input>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="通讯作者单位" prop="coauthorName">
          <el-col :span="12">
            <el-autocomplete
              clearable
              v-model="ruleForm.coauthorName"
              :fetch-suggestions="queryCompany"
              placeholder=""
            ></el-autocomplete>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="通讯作者姓名" prop="coauthorName">
          <el-col :span="12">
            <el-input clearable v-model="ruleForm.coauthorName" placeholder=""></el-input>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item label="作者信息" prop="authors">
          <el-col :span="12">
            <label>姓名-单位-是否是国际学籍-是否是通讯作者</label>
            <el-input v-model="ruleForm.authors" rows="5" type="textarea"></el-input>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item
          v-for="(teacherArr, index) in ruleForm.teacherArr"
          :label="'作者信息' + (index+1)"
          :key="teacherArr.key"
          :prop="'teacherArr.' + index + '.value'"
        >
          <el-col :span="12">
            <el-select v-model="teacherArr.name" placeholder="请选择老师" prop="persons">
              <el-option
                v-for="item in teacherList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-input
              clearable
              v-model="teacherArr.num"
              placeholder="请输入单位"
              label="字数"
              type="textarea"
            ></el-input>
            <el-checkbox v-model="teacherArr.stu">是否国际学籍【不含港澳台】</el-checkbox>
            <el-checkbox v-model="teacherArr.tx">是否是通讯作者</el-checkbox>
            <el-button style="width:200px;" @click="removeTeacher(teacherArr)">删除</el-button>
          </el-col>
        </el-form-item>-->
        <!-- <el-form-item v-if="!['show'].includes(operate)">
          <el-button type="primary" @click="addTeacher('ruleForm')">继续添加老师</el-button>
        </el-form-item>-->
        <div>
          <el-divider content-position="left">附件</el-divider>
          <el-table
            :data="additionFiles"
            border
            style="width: 100%"
            size="normal"
            :disabled="true"
            v-loading="fileLoading"
            header-row-class-name="h30"
            header-cell-class-name="tc-g2 bc-g"
          >
            <el-table-column
              :show-overflow-tooltip="true"
              type="index"
              label="#"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column :show-overflow-tooltip="true" prop label="文件名" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.name.split('/').pop() }}</span>
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="downloadAdditionFile(scope.row)" type="primary" size="mini">下载</el-button>
                <el-button @click="deleteAdditionFile(scope.row)" type="danger" size="mini">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-upload
            class="dragger"
            :show-file-list="false"
            :on-success="uploadAdditionSuccess"
            drag
            :headers="header"
            action="http://bs.hk.darkal.cn/mgr/upload"
            multiple
          >
            <div class="el-upload__tip" slot="tip"></div>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </div>
        <!-- <el-form-item v-if="['edit'].includes(operate) && ruleForm.id" label="附件" prop="files">
          <el-upload
            class
            :headers="header"
            :file-list="fileLists"
            :on-success="fileUploadSuccess"
            action="http://bs.hk.darkal.cn/mgr/upload?token='AuthenticationToken'"
          >
            <el-button size="normal" class type="primary">附件上传</el-button>
          </el-upload>
        </el-form-item>-->
        <el-form-item label="审核状态:" v-if="['show'].includes(operate)">
          <el-select v-model="ruleForm.auditFlag" size="normal" placeholder="请选择状态">
            <el-option label="未审核" value="0"></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="未通过" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import moment from "moment";
import axios from "~/plugins/axios2";
export default {
  layout: "normal",
  data() {
    var validateNumber = (rule, value, callback) => {
      if (!value || value <= 0) {
        value = parseInt(value);
        callback(new Error("请输入大于0的数字"));
      } else {
        callback();
      }
    };
    return {
      pick: false,
      examineForm: {
        auditFlag: "0"
      },
      fileLoading: false,
      fileData: [],
      action: "",
      deptid: "",
      examineDialog: false,
      tableData: [],
      operate: "",
      yearsOptions: [],
      dialogFormVisible: false,
      total: 0,
      page: 1,
      roleId: 0,
      fileLists: [],
      query: {
        limit: 14,
        offset: 0,
        order: "desc",
        condition: ""
      },
      fileurl: "",
      header: {},
      fileList: [],
      additionFiles: [],
      ruleForm: {
        coauthorName: "",
        doi: "",
        level: "",
        // coauthorName: "",
        score: "",
        journal: "",
        authors: "",
        highlyCited: "",
        cateNumber: "",
        companys: [],
        subsidizeSource: "",
        wos: "",
        teacherArr: [
          {
            name: "",
            num: "",
            stu: false,
            tx: false
          }
        ]
      },
      teacherList: [],
      loading: true,
      companyArr: [],
      filesInfo: [],
      fileItems: [],
      rules: {
        journal: [
          { required: true, message: "请输入期刊名称", trigger: "blur" }
        ],
        authors: [
          { required: true, message: "请输入作者信息", trigger: "blur" }
        ],
        doi: [{ required: true, message: "请输入DOI号", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        point: [
          { required: true, message: "请输入本人计分", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        coauthorName: [
          { required: true, message: "请输入通讯作者", trigger: "blur" },
          { validator: validateNumber, trigger: "blur" }
        ],
        cateNumber: [
          { required: true, message: "请输入分类编号", trigger: "blur" }
        ],
        score: [{ required: true, message: "请输入分数", trigger: "blur" }],
        subsidizeSource: [
          { required: true, message: "请输入资助来源", trigger: "blur" }
        ],
        wos: [{ required: true, message: "请输入WoS号", trigger: "blur" }],
        highlyCited: [
          {
            required: true,
            message: "请输入ESI经济/商学高被引",
            trigger: "blur"
          }
        ],
        half: [{ required: true, message: "请选择是否半价", trigger: "blur" }],
        level: [{ required: true, message: "请选择分级", trigger: "blur" }],
        year: [{ required: true, message: "请输入年份", trigger: "blur" }],
        title: [{ required: true, message: "请输入论文名称", trigger: "blur" }]
        // files:[{ required: true, message: "请上传附件", trigger: "blur" }]
      }
    };
  },
  filters: {
    statusFilter: function(value) {
      return {
        "0": "未审核",
        "1": "已通过",
        "2": "未通过"
      }[value.toString()];
    },
    flagFilter: function(value) {
      return {
        true: "是",
        false: "否"
      }[value.toString()];
    }
  },
  mounted() {
    this.companyArr = localStorage.getItem("companyArr")
      ? JSON.parse(localStorage.getItem("companyArr"))
      : [];
  },

  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updataCache() {
      this.companys.push({
        value: this.ruleForm.coauthorName
      });
      this.companys = _.uniqWith(this.companys, _.isEqual);
      localStorage.setItem("names", JSON.stringify(this.companys));
    },
    downLoadFile(rows) {
      alert(rows);
      if (rows.files) {
        window.open(rows.files);
      } else {
        this.$message({
          type: "info",
          message: "该条记录无附件"
        });
      }
    },
    async uploadAdditionSuccess(response) {
      console.log("this.ruleForm:::", this.ruleForm);
      if (response && response.indexOf("http") != -1) {
        this.additionFiles.push({
          name: response
        });
        if (this.operate == "edit") {
          this.ruleForm.files = JSON.stringify(this.additionFiles);
          await axios.$post("/articleEn/update", this.ruleForm);
        }
      }
    },
    downloadAdditionFile(row) {
      window.open(row.name);
    },
    async deleteAdditionFile(row) {
      this.additionFiles = this.additionFiles.filter(
        it => it.name !== row.name
      );
      if (this.operate == "edit") {
        this.ruleForm.files = JSON.stringify(this.additionFiles);
        await axios.$post("/articleEn/update", this.ruleForm);
      }
    },
    downLoad() {
      window.open("http://bsoa.csu.edu.cn/files/英文论文分级标准.zip");
    },
    removeAuthor(item) {
      var index = this.ruleForm.author.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.author.splice(index, 1);
      }
    },
    removePoint(item) {
      var index = this.ruleForm.point.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.point.splice(index, 1);
      }
    },
    addAuthor() {
      this.ruleForm.author.push({
        value: "",
        key: Date.now() + "author"
      });
      this.ruleForm.point.push({
        value: "",
        key: Date.now() + "point"
      });
    },

    fileUploadSuccess(res, file, files) {
      for (let i = 0; i < files.length; i++) {
        const element = files[i];
        this.fileurl += element.response;
      }
    },
    queryCompany(queryString, cb) {
      var companyArr = this.companyArr;
      var results = queryString
        ? companyArr.filter(this.createCompanyArrFilter(queryString))
        : companyArr;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createCompanyArrFilter(queryString) {
      return companyArr => {
        return (
          companyArr.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleCurrentChange(val) {
      this.query.offset = this.query.limit * (this.page - 1);
      this.list();
    },
    async list() {
      for (const key in this.query) {
        if (this.query.hasOwnProperty(key)) {
          const element = this.query[key];
          if (key == "endDate" || key == "startDate") {
            console.log(typeof element);
            if (element) {
              this.query[key] = moment(element).format("YYYY-MM-DD");
            } else {
              delete this.query[key];
            }
            console.log(element);
          }
          if (element == "" && key != "condition" && key != "offset") {
            delete this.query[key];
          }
        }
      }
      let user = localStorage.getItem("roles");
      if (!user.includes(888)) {
        this.query.editor = localStorage.getItem("userId");
      }
      this.loading = true;
      let res = await axios.$post("/articleEn/list", this.query);
      this.tableData = res.rows;
      // for (let i = 0; i < this.tableData.length; i++) {
      //   const element = this.tableData[i];
      //   this.tableData[i].half = element.half == true ? "是" : "否";
      // }
      this.total = parseInt(res.total);
      this.loading = false;
    },
    removeTeacher(item) {
      console.log(item);
      var index = this.ruleForm.teacherArr.indexOf(item);
      if (index !== -1 && index != 0) {
        this.ruleForm.teacherArr.splice(index, 1);
      }
    },
    addTeacher() {
      this.ruleForm.teacherArr.push({
        name: "",
        num: "",
        stu: false,
        tx: false
      });
    },
    async exportData(flag) {
      let data = "";
      if (flag == "temp") {
        data = await axios.$download("/articleEn/export?id=-1", {});
      } else {
        data = await axios.$download("/articleEn/export", {
          params: this.query
        });
      }
      if (data) {
        let url = window.URL.createObjectURL(new Blob([data]));
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "科研奖励-英文论文.xls");
        document.body.appendChild(link);
        link.click();
      }
    },
    async submitForm(formName) {
      // for (let i = 0; i < this.ruleForm.teacherArr.length; i++) {
      //   let element = this.ruleForm.teacherArr[i];
      //   for (const key in element) {
      //     if (element.hasOwnProperty(key)) {
      //       let info = element[key];
      //       console.log(info);
      //       if (key == "name") {
      //         this.ruleForm.authors += parseInt(info);
      //       }
      //       if (key == "num") {
      //         this.ruleForm.authors += "|" + info;
      //       }
      //       if (key == "stu") {
      //         this.ruleForm.authors += "|" + info;
      //       }
      //       if (key == "tx") {
      //         this.ruleForm.authors += "|" + info + ",";
      //       }
      //     }
      //   }
      //   if (i == this.ruleForm.teacherArr.length - 1) {
      //     this.ruleForm.authors = this.ruleForm.authors.substr(
      //       0,
      //       this.ruleForm.authors.length - 1
      //     );
      //   }
      // }
      if (this.ruleForm.files)
        this.ruleForm.files = JSON.stringify(this.additionFiles);
      let verification = false;
      this.$refs[formName].validate(valid => {
        if (valid) {
          verification = true;
          console.log("success");
          return true;
        } else {
          verification = false;
          this.ruleForm.authors = "";
          console.log("error submit!!");
          return false;
        }
      });
      if (verification) {
      } else {
        this.$message({
          type: "info",
          message: "请填写正确数据"
        });
        return;
      }
      switch (this.operate) {
        case "add":
          if (this.filesInfo != [])
            // this.ruleForm.files = JSON.stringify(this.filesInfo);
            await axios.$post("/articleEn/add", this.ruleForm);
          this.fileurl = "";
          break;
        case "edit":
          this.ruleForm.cooPaper = "是" ? true : false;
          await axios.$post("/articleEn/update", this.ruleForm);
          break;
      }
      this.dialogFormVisible = false;
      await this.list();
    },

    showDialog(row) {
      this.dialogFormVisible = true;
      this.formDisabled = false;
      if (this.operate === "add") {
        this.ruleForm = {
          id: "",
          doi: "",
          level: "",
          // coauthorName: "",
          // coauthorName: "",
          score: "",
          journal: "",
          authors: "",
          highlyCited: "",
          cateNumber: "",
          teacherArr: [
            {
              name: "",
              num: "",
              stu: false,
              tx: false
            }
          ],
          editor: JSON.parse(localStorage.getItem("userInfo")).id
        };
        this.additionFiles = [];
      } else {
        row.cooPaper = row.cooPaper.toString();
        this.ruleForm = row;
        this.ruleForm.teacherArr = [];
        console.log(row);
        if (row.files) this.additionFiles = JSON.parse(row.files);
        // this.fileItems = JSON.parse(row.files);
        let teacherInfo = row.authors.split(",");
        for (let i = 0; i < teacherInfo.length; i++) {
          const element = teacherInfo[i];
          this.ruleForm.teacherArr.push({
            name: "",
            num: "",
            stu: false,
            tx: false
          });
          let teacher = element.split("|");
          // for (let j = 0; j < teacher.length; j++) {
          //   const item = teacher[j];
          //   console.log(item, "======item");
          //   if (j == 0) {
          //     this.ruleForm.teacherArr[i].name = this.ruleForm.userName.split(
          //       ","
          //     )[i];
          //   } else if (j == 1) {
          //     this.ruleForm.teacherArr[i].num = item;
          //   } else if (j == 2) {
          //     if (item == 0) {
          //       this.ruleForm.teacherArr[i].stu = false;
          //     } else {
          //       this.ruleForm.teacherArr[i].stu = true;
          //     }
          //   } else {
          //     if (item == 0) {
          //       this.ruleForm.teacherArr[i].tx = false;
          //     } else {
          //       this.ruleForm.teacherArr[i].tx = true;
          //     }
          //   }
          // }
        }
        this.ruleForm.reformPaper = row.reformPaper.toString();
        this.ruleForm.auditFlag = row.auditFlag.toString();
      }
    },
    async del(row) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          console.log(row);
          let articleEnId = row.id;
          await axios.$post("/articleEn/delete", {
            articleEnId: articleEnId
          });
          this.list();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    uploadSuccess() {
      this.$message({
        type: "success",
        message: "上传成功"
      });
      this.list();
    },
    uploadFileSuccess(res, file) {
      console.log(res);
      console.log(file);
      this.filesInfo.push({
        url: res,
        files: file.name,
        createTime: moment(new Date()).format("YYYY-MM-DD")
      });
      console.log(this.filesInfo[0]);
    },
    async handleCommand(command) {
      console.log(command);
      switch (command) {
        case "download":
          this.exportData(command);
          break;
        case "examine":
          let deleteList = [];
          for (let i = 0; i < this.tableData.length; i++) {
            const element = this.tableData[i];
            console.log(element);
            if (element.pick) {
              deleteList.push(element);
            }
          }
          if (deleteList.length <= 0) {
            await this.$confirm("未选中数据", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(async () => {});
            return;
          }
          this.examineDialog = true;
          break;
        case "delCount":
          this.delCount();
          break;
        case "temp":
          this.exportData(command);
          break;
      }
    },

    async changeFlag(row) {
      row.pick = !row.pick;
    },
    async delCount() {
      let deleteList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          deleteList.push(element);
        }
      }
      if (deleteList.length <= 0) {
        await this.$confirm("未选中数据", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(async () => {});
        return;
      }
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          for (let i = 0; i < deleteList.length; i++) {
            const element = deleteList[i];
            let articleEnId = element.id;
            await axios.$post("/articleEn/delete", {
              articleEnId: articleEnId
            });
          }
          this.tableData = [];
          await this.list();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async queryTeacher() {
      this.teacherList = await axios.$post("/mgr/list", {
        order: "desc",
        offset: 0,
        limit: 999999
      });
      this.teacherList = this.teacherList.rows;
    },
    async examineData(flag) {
      let examineList = [];
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i];
        console.log(element);
        if (element.pick) {
          examineList.push(element);
        }
      }
      for (let i = 0; i < examineList.length; i++) {
        const element = examineList[i];
        console.log(element.auditFlag, "=======" + flag);
        this.examineForm.id = element.id;
        if (flag == "success") {
          this.examineForm.auditFlag = 1;
        } else {
          this.examineForm.auditFlag = 2;
        }
        await axios.$post("/articleEn/update", this.examineForm);
      }
      this.list();
      this.examineDialog = false;
      this.$message({
        type: "success",
        message: "审核成功!"
      });
    }
  },
  async mounted() {
    this.header = {
      Authorization: localStorage.getItem("message")
    };
    let self = this;
    let year = moment(new Date()).format("YYYY");
    for (let i = year; i > 1900; i--) {
      self.yearsOptions.push({
        value: i,
        label: i
      });
    }
    this.deptid = JSON.parse(localStorage.getItem("userInfo")).deptid;
    await this.queryTeacher();
    this.list();
    this.roleId = localStorage.getItem("roleId");
  }
};
</script>

<style>
.el-drawer__body {
  overflow: auto;
  /* overflow-x: auto; */
}

/*2.隐藏滚动条，太丑了*/
.el-drawer__container ::-webkit-scrollbar {
  display: none;
}
.el-autocomplete {
  width: 100%;
}
el-from {
  overflow: auto;
}

#authorBox {
  width: 600px;
}
.dragger {
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.el-upload-dragger .el-icon-upload {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 0px;
}
.el-upload-dragger {
  background-color: #fff;
  border: 0px dashed #d9d9d9;
  border-radius: 0px;
  box-sizing: border-box;
  width: 360px;
  height: 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
}
</style>