<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { createAdminUser, deleteAdminUser, getAdminUsers, getSystemConfig, updateSystemConfig } from '@/api'
import type { SystemConfig } from '@/api'
import type { UserType } from '@/api/user'
import { useUserStore } from '@/stores/user'

type AccountRow = {
  id?: number
  username: string
  name: string
  role: UserType
  password: string
}

const router = useRouter()
const userStore = useUserStore()
const accountFormRef = ref<FormInstance>()
const loadingAccounts = ref(false)
const savingConfig = ref(false)

const accountForm = reactive<AccountRow>({
  username: '',
  name: '',
  role: 'user',
  password: '',
})

const accountRules: FormRules<typeof accountForm> = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const accounts = ref<AccountRow[]>([])

const indicators = reactive<SystemConfig>({
  waterPrice: 3.58,
  baseQuota: 1200,
  warningThreshold: 85,
  pushStrategy: '每日 09:00 自动推送节水建议',
})

const roleLabelMap: Record<UserType, string> = {
  user: '用户',
  admin: '管理员',
  repair: '维修人员',
}

const getRoleLabel = (role: UserType) => roleLabelMap[role]

const loadAccounts = async () => {
  loadingAccounts.value = true
  try {
    accounts.value = await getAdminUsers()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '账号列表加载失败')
  } finally {
    loadingAccounts.value = false
  }
}

const loadConfig = async () => {
  try {
    const config = await getSystemConfig()
    indicators.waterPrice = config.waterPrice
    indicators.baseQuota = config.baseQuota
    indicators.warningThreshold = config.warningThreshold
    indicators.pushStrategy = config.pushStrategy
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '系统配置加载失败')
  }
}

const addAccount = async () => {
  if (!accountFormRef.value) {
    return
  }

  const valid = await accountFormRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  try {
    const created = await createAdminUser({ ...accountForm })
    accounts.value.unshift(created)
    ElMessage.success('账号已添加')
    accountFormRef.value.resetFields()
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '账号添加失败')
  }
}

const removeAccount = async (username: string) => {
  await ElMessageBox.confirm(`确认删除账号 ${username} 吗？`, '删除提示', { type: 'warning' })
  try {
    await deleteAdminUser(username)
    accounts.value = accounts.value.filter((item) => item.username !== username)
    ElMessage.success('账号已删除')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '账号删除失败')
  }
}

const saveIndicators = async () => {
  savingConfig.value = true
  try {
    await updateSystemConfig({ ...indicators })
    ElMessage.success('数据配置已保存')
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '数据配置保存失败')
  } finally {
    savingConfig.value = false
  }
}

const logout = async () => {
  userStore.clearUserInfo()
  await router.push('/login')
}

onMounted(async () => {
  await Promise.all([loadAccounts(), loadConfig()])
})
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__header">
      <div>
        <h1>后台管理页面</h1>
        <p>当前登录：{{ userStore.name || '管理员' }}，可进行账号管理和数据修改。</p>
      </div>
      <el-button type="primary" plain @click="logout">退出登录</el-button>
    </header>

    <main class="admin-page__content">
      <section class="admin-card">
        <div class="admin-card__title">账号管理</div>
        <div class="account-layout">
          <el-form ref="accountFormRef" :model="accountForm" :rules="accountRules" label-position="top" class="account-form">
            <el-form-item label="账号" prop="username">
              <el-input v-model="accountForm.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="姓名" prop="name">
              <el-input v-model="accountForm.name" placeholder="请输入姓名" />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-select v-model="accountForm.role" placeholder="请选择角色">
                <el-option label="用户" value="user" />
                <el-option label="管理员" value="admin" />
                <el-option label="维修人员" value="repair" />
              </el-select>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="accountForm.password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-button type="primary" @click="addAccount">新增账号</el-button>
          </el-form>

          <el-table v-loading="loadingAccounts" :data="accounts" class="admin-table" height="100%">
            <el-table-column prop="username" label="账号" min-width="120" />
            <el-table-column prop="name" label="姓名" min-width="120" />
            <el-table-column label="角色" min-width="120">
              <template #default="{ row }">
                {{ getRoleLabel(row.role as UserType) }}
              </template>
            </el-table-column>
            <el-table-column prop="password" label="密码" min-width="120" />
            <el-table-column label="操作" min-width="100">
              <template #default="{ row }">
                <el-button link type="danger" @click="removeAccount(row.username)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>

      <section class="admin-card">
        <div class="admin-card__title">数据修改</div>
        <div class="metrics-layout">
          <el-form label-position="top" class="metrics-form">
            <el-form-item label="当前水价（元/m³）">
              <el-input-number v-model="indicators.waterPrice" :precision="2" :step="0.1" />
            </el-form-item>
            <el-form-item label="默认定额（m³）">
              <el-input-number v-model="indicators.baseQuota" :step="10" />
            </el-form-item>
            <el-form-item label="预警阈值（%）">
              <el-slider v-model="indicators.warningThreshold" />
            </el-form-item>
            <el-form-item label="消息推送策略">
              <el-input v-model="indicators.pushStrategy" />
            </el-form-item>
            <el-button type="primary" :loading="savingConfig" @click="saveIndicators">保存配置</el-button>
          </el-form>

          <div class="metrics-preview">
            <div class="preview-card">
              <span>当前水价</span>
              <strong>{{ indicators.waterPrice }} 元/m³</strong>
            </div>
            <div class="preview-card">
              <span>默认定额</span>
              <strong>{{ indicators.baseQuota }} m³</strong>
            </div>
            <div class="preview-card">
              <span>预警阈值</span>
              <strong>{{ indicators.warningThreshold }}%</strong>
            </div>
            <div class="preview-card">
              <span>推送策略</span>
              <strong>{{ indicators.pushStrategy }}</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style lang="scss" scoped>
.admin-page {
  height: 100%;
  overflow: auto;
  padding: 28px;
  background:
    radial-gradient(circle at top, rgba(57, 163, 255, 0.18), transparent 24%),
    linear-gradient(180deg, #07111e 0%, #0b1f3f 100%);
  color: $color-text-primary;

  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;

    h1 {
      margin: 0 0 10px;
      font-size: 34px;
    }

    p {
      margin: 0;
      color: $color-text-secondary;
    }
  }

  &__content {
    display: grid;
    gap: 20px;
    padding-bottom: 28px;
  }
}

.admin-card {
  @include panel-surface;
  @include panel-overlay;
  padding: 20px;

  &__title {
    margin-bottom: 18px;
    font-size: 20px;
    font-weight: 700;
  }
}

.account-layout,
.metrics-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 18px;
}

.account-form,
.metrics-form {
  padding: 18px;
  border-radius: 14px;
  background: rgba(7, 20, 40, 0.7);
}

.metrics-preview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.preview-card {
  padding: 18px;
  border: 1px solid rgba(115, 182, 255, 0.12);
  border-radius: 14px;
  background: rgba(7, 20, 40, 0.7);

  span {
    display: block;
    margin-bottom: 8px;
    color: $color-text-secondary;
  }

  strong {
    color: #fff;
    font-size: 24px;
  }
}

.admin-table {
  background: transparent;
}

:deep(.admin-table.el-table) {
  --el-table-tr-bg-color: transparent;
  --el-table-row-hover-bg-color: rgba(86, 168, 255, 0.08);
  --el-table-header-bg-color: rgba(83, 129, 198, 0.16);
  --el-table-border-color: rgba(115, 182, 255, 0.12);
  --el-table-text-color: #dfeeff;
  --el-table-header-text-color: #f4f8ff;
  --el-fill-color-lighter: transparent;
}

:deep(.admin-table .el-table__inner-wrapper::before) {
  display: none;
}

@media (max-width: 1200px) {
  .account-layout,
  .metrics-layout,
  .metrics-preview {
    grid-template-columns: 1fr;
  }
}
</style>
