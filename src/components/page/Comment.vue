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
                <el-table-column prop="user.username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="content" label="评论内容" align="center"></el-table-column>
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
                <el-form-item label="内容">
                    <el-input v-model="form.content"></el-input>
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
import { getCommentList, updateCommentById, deleteCommentById, getCommentSearchList } from '../../network/user';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 20
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
        this.get_comment_list(0,20);
        this.get_comment_length(0,18446744073709551615)
    },
    methods: {
        async get_comment_list(offset,limit) {
            const result = await getCommentList(offset,limit);
            // console.log(result);
            this.tableData = result;
        },
        async get_comment_length(offset,limit) {
            const result = await getCommentList(offset, limit);
            this.pageTotal = result.length;
        },
        async get_comment_search_list(name, offset, limit) {
            const searchResult = await getCommentSearchList(name, offset, limit);
            this.tableData = searchResult;
        },
        async get_comment_search_length(name, offset, limit){
            const result = await getCommentSearchList(name, offset, limit);
            this.pageTotal = result.length;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            if (this.query.name) {
                this.isSearch = true;
                this.get_comment_search_length(this.query.name, 0, 18446744073709551615);
                this.get_comment_search_list(this.query.name,0,20)
            } else {
                this.isSearch = false;
                this.get_comment_list(0, 20);
                this.get_comment_length(0, 18446744073709551615);
            }
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            console.log(row.id);
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteCommentById(row.id).then(() => {
                        this.$message.success('删除成功');
                        this.get_comment_list((this.query.pageIndex - 1) * 20, 20);
                    })
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async delAllSelection() {
            const length = this.multipleSelection.length;
            for (let i = 0; i < length; i++) {
                // console.log(this.multipleSelection[i].id);
                await deleteCommentById(this.multipleSelection[i].id);
            }
            this.$message.success('删除成功');
            this.get_comment_list((this.query.pageIndex - 1) * 20, 20);
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
            const { id, content } = this.form;
            await updateCommentById(id,content)
            if (content) {
                this.editVisible = false;
                await 
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
                this.get_comment_list((val - 1) * 20, 20);
            } else {
                this.get_comment_search_list(this.query.name,(val - 1) * 20, 20);
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
