<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 动漫列表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除</el-button>
                <el-input v-model="query.name" placeholder="动漫名字" class="handle-input mr10"></el-input>
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
                <el-table-column prop="name" label="动漫名字" align="center"></el-table-column>
                <el-table-column prop="author" label="作者" align="center"></el-table-column>
                <el-table-column label="动漫封面(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="scope.row.img" :preview-src-list="[scope.row.img]"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="类型" align="center"></el-table-column>
                <el-table-column prop="place" label="地区" align="center"></el-table-column>
                <el-table-column prop="language" label="语言" align="center"></el-table-column>
                <el-table-column prop="year" label="发布时间" align="center"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row.id, scope.row)">编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除</el-button
                        >
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
                <el-form-item label="动漫名字">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="作者">
                    <el-input v-model="form.author"></el-input>
                </el-form-item>
                <el-form-item label="封面地址">
                    <el-input v-model="form.img"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="地区">
                    <el-input v-model="form.place"></el-input>
                </el-form-item>
                <el-form-item label="语言">
                    <el-input v-model="form.language"></el-input>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-input v-model="form.year"></el-input>
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
import { getAnimeList, updateAnimeById, deleteAnimeById, getSearchList } from '../../network/anime';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            isSearch: false
        };
    },
    created() {
        this.get_anime_list(0, 10);
        this.get_anime_length(0, 18446744073709551615);
    },
    methods: {
        async get_anime_list(offset, limit) {
            const result = await getAnimeList(offset, limit);
            // console.log(result);
            this.tableData = result.result;
        },
        async get_anime_length(offset, limit) {
            const result = await getAnimeList(offset, limit);
            this.pageTotal = result.result.length;
        },
        async get_search_list(name, offset, limit) {
            const result = await getSearchList(name, offset, limit);
            this.pageTotal = result.result.length;
            const searchResult = await getSearchList(name, 0, 10);
            this.tableData = searchResult.result;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            if (this.query.name) {
                this.isSearch = true;
                this.get_search_list(this.query.name, 0, 18446744073709551615);
            } else {
                this.isSearch = false;
                this.get_anime_list(0, 10);
                this.get_anime_length(0, 18446744073709551615);
            }
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    deleteAnimeById(row.id);
                    this.$message.success('删除成功');
                    this.get_anime_list((this.query.pageIndex - 1) * 10, 10);
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
                await deleteAnimeById(this.multipleSelection[i].id);
            }
            this.$message.success('删除成功');
            this.get_anime_list((this.query.pageIndex - 1) * 10, 10);
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
            const { id, name, author, type, place, language, year, img } = this.form;
            if (name && author && type && place && language && year && img) {
                this.editVisible = false;
                await updateAnimeById(id, name, author, type, place, language, year, img);
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
                this.get_anime_list((val - 1) * 10, 10);
            } else {
                this.get_search_list((val - 1) * 10, 10);
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
</style>
