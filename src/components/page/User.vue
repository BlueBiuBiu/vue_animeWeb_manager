<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 用户列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="password" label="密码" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.avatar" :preview-src-list="[scope.row.avatar]">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="收藏" align="center">
                    <template slot-scope="scope">
                        <div class="collect" v-if="scope.row.collect">
                            <div v-for="(item, index) in scope.row.collect">
                                <span>{{ item.name }}</span>
                                <el-button
                                    type="text"
                                    icon="el-icon-delete"
                                    class="red"
                                    @click="handleDeleteCollect(item, index, scope.row)"
                                >
                                    删除
                                </el-button>
                            </div>
                        </div>
                        <div v-else class="collect">
                            <div class="no-collect">暂无收藏</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getUserList, updateAnimeById, deleteUserById, getSearchList, deleteUserCollectById, getUserAvatar } from '../../network/user';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 2
            },
            tableData: [],
            multipleSelection: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            isSearch: false
        };
    },
    created() {
        this.get_user_list(0, 2);
        this.get_user_length(0, 18446744073709551615);
    },
    methods: {
        async get_user_list(offset, limit) {
            const result = await getUserList(offset, limit);
            const avatars = await getUserAvatar();
            for (let item of result) {
                for (let avatar of avatars) {
                    if (item.id === avatar.id) {
                        item.avatar = avatar.avatar_url;
                    }
                }
                if (item.collect) {
                    item.collect = JSON.parse(item.collect);
                }
            }
            this.tableData = result;
        },
        async get_user_length(offset, limit) {
            const result = await getUserList(offset, limit);
            this.pageTotal = result.length;
        },
        async get_search_list(name, offset, limit) {
            const searchResult = await getSearchList(name, offset, limit);
            this.tableData = searchResult;
        },
        async get_search_list_length(name, offset, limit) {
            const result = await getSearchList(name, offset, limit);
            this.pageTotal = result.length;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            if (this.query.name) {
                this.isSearch = true;
                this.get_search_list_length(this.query.name, 0, 18446744073709551615);
                this.get_search_list(this.query.name, 0, 2)
            } else {
                this.isSearch = false;
                this.get_user_list(0, 2);
                this.get_user_length(0, 18446744073709551615);
            }
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteUserById(row.id).then(() => {
                        this.$message.success('删除成功');
                        this.get_user_list((this.query.pageIndex - 1) * 2, 2);
                    })
                    
                })
                .catch(() => {});
        },
        async handleDeleteCollect(item, index, row) {
            let collect = [];
            for (let userInfo of this.tableData) {
                if (userInfo.id === row.id) {
                    collect = userInfo.collect;
                    collect.splice(index, 1);
                }
            }
            await deleteUserCollectById(row.id, collect);
            this.$message.success('删除成功');
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async delAllSelection() {
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
                await deleteUserById(this.multipleSelection[i].id);
            }
            this.$message.success('删除成功');
            this.get_user_list((this.query.pageIndex - 1) * 2, 2);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存编辑
        async saveEdit() {
            const { id, password } = this.form;
            console.log(id, password);
            if (password) {
                this.editVisible = false;
                await updateAnimeById(id, password);
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
            } else {
                this.$message({
                    message: '内容不能为空',
                    type: 'warning'
                });
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            if (!this.isSearch) {
                this.get_user_list((val - 1) * 2, 2);
            } else {
                this.get_search_list(this.query.name,(val - 1) * 2, 2);
            }
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.collect {
    height: 110px;
    overflow-y: scroll;
}

.no-collect {
    font-size: 14px;
    color: #c0c4cc;
    line-height: 100px;
}

/* 滑轮样式 */
::-webkit-scrollbar {
    width: 8px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: #fff;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #ebeef5;
}
</style>
