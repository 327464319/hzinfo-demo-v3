<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
    <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.tenantId"
                auto-complete="off"
                :placeholder="$t('login.tenantId')">
        <i slot="prefix" class="icon-quanxian"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="phone">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.phone"
                auto-complete="off"
                :placeholder="$t('login.phone')">
        <i slot="prefix"
           class="icon-shouji"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="code">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.code"
                auto-complete="off"
                :placeholder="$t('login.code')">
        <i slot="prefix"
           class="icon-yanzhengma"
           style="margin-top:6px;"/>
        <template slot="append">
          <span @click="handleSend"
                class="msg-text"
                :class="[{display:msgKey}]">{{msgText}}</span>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button size="small"
                 type="primary"
                 @click.native.prevent="handleLogin"
                 class="login-submit">{{$t('login.submit')}}</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isvalidatemobile } from "@/util/validate";
import {info} from "@/api/system/tenant";
import {getTopUrl} from "@/util/util";
import {getPhoneCode} from "@/api/user";
import { mapGetters } from "vuex";
export default {
  name: "codelogin",
  data() {
    const validatePhone = (rule, value, callback) => {
      if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback();
      }
    };
    return {
      tenantMode: this.website.tenantMode,
      msgText: "",
      msgTime: "",
      msgKey: false,
      loginForm: {
        //租户ID
        tenantId: this.website.tenantId,
        phone: "",
        code: "",
        key:''
      },
      loginRules: {
        tenantId: [
            {required: false, message: "请输入租户ID", trigger: "blur"}
          ],
        phone: [{ required: true, trigger: "blur", validator: validatePhone }]
      }
    };
  },
  created() {
    this.getTenant()
    this.msgText = this.config.MSGINIT;
    this.msgTime = this.config.MSGTIME;
  },
  mounted() {},
  computed: {
    ...mapGetters(["tagWel"]),
    config() {
      return {
        MSGINIT: this.$t("login.msgText"),
        MSGSCUCCESS: this.$t("login.msgSuccess"),
        MSGTIME: 60
      };
    }
  },
  props: [],
  methods: {
    handleSend() {
      if (this.msgKey) return;
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          getPhoneCode(this.loginForm.phone).then(res => {
              this.$message({
                type: "success",
                message: "验证码发送成功!"
              });
              this.loginForm.key = res.data.data.id
              this.msgText = this.msgTime + this.config.MSGSCUCCESS;
              this.msgKey = true;
              const time = setInterval(() => {
                this.msgTime--;
                this.msgText = this.msgTime + this.config.MSGSCUCCESS;
                if (this.msgTime === 0) {
                  this.msgTime = this.config.MSGTIME;
                  this.msgText = this.config.MSGINIT;
                  this.msgKey = false;
                  clearInterval(time);
                }
              }, 1000);
          }).catch((e) => {
            console.log(e)
          });
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch("LoginByPhone", this.loginForm).then(() => {
            this.$router.push({ path: this.tagWel.value });
          });
        }
      });
    },
    getTenant() {
        let domain = getTopUrl();
        // 临时指定域名，方便测试
        //domain = "https://bladex.vip";
        info(domain).then(res => {
          const data = res.data;
          if (data.success && data.data.tenantId) {
            this.tenantMode = false;
            this.loginForm.tenantId = data.data.tenantId;
            document.getElementsByClassName("login-container")[0].style.backgroundImage=`url(${data.data.backgroundUrl})`;
            // this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
          }
        })
      }
  }
};
</script>

<style>
.msg-text {
  display: block;
  width: 60px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}
.msg-text.display {
  color: #ccc;
}
</style>
