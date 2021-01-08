
<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 表单 </el-breadcrumb-item>
                <el-breadcrumb-item>动漫上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="动漫名称">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="form.type" placeholder="请选择类型" style="width: 100%">
                            <el-option label="恋爱" value="恋爱"></el-option>
                            <el-option label="竞技" value="竞技"></el-option>
                            <el-option label="校园" value="校园"></el-option>
                            <el-option label="热血" value="热血"></el-option>
                            <el-option label="青春" value="青春"></el-option>
                            <el-option label="搞笑" value="搞笑"></el-option>
                            <el-option label="玄幻" value="玄幻"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="生产地区">
                        <el-select v-model="form.place" placeholder="请选择地区" style="width: 100%">
                            <el-option label="日本" value="日本"></el-option>
                            <el-option label="国内" value="国内"></el-option>
                            <el-option label="欧美" value="欧美"></el-option>
                            <el-option label="其它" value="其它"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="时间-语言">
                        <el-col :span="11">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.year"
                                value-format="yyyy-MM-dd"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">-</el-col>
                        <el-col :span="11">
                            <el-select v-model="form.language" placeholder="请选择语言" style="width: 100%">
                                <el-option label="日语" value="日语"></el-option>
                                <el-option label="国语" value="国语"></el-option>
                                <el-option label="英语" value="英语"></el-option>
                                <el-option label="粤语" value="粤语"></el-option>
                            </el-select>
                        </el-col>
                           
                    </el-form-item>
                    <el-form-item label="作者">
                        <el-input v-model="form.author"></el-input>
                    </el-form-item>
                    <el-form-item label="封面地址">
                        <el-input v-model="form.img"></el-input>
                    </el-form-item>
                    <el-form-item label="总集数">
                        <el-input v-model="form.total"></el-input>
                    </el-form-item>
                    <el-form-item label="视频链接地址">
                        <el-input type="textarea" rows="5" v-model="form.link"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">上传</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { uploadAnime } from "../../network/anime"
import { Utils } from "../../utils/numberToChinese"
export default {
    name: 'baseform',
    data() {
        return {
            form: {
                name: '',
                type: '',
                place: '',
                year: '',
                language: '',
                author: '',
                img: '',
                total: 0,
                link: ''
            }
        };
    },
    methods: {
        async onSubmit() {
            const { name,author,type,place,language,year,img,total,link } = this.form
            let index = []
            for(let i=1; i<=total; i++){
                index.push("第" + Utils.numberToChinese(i) + "集")
            }
            index = index.join()
            console.log(name,author,type,place,language,year,img,index,link);
            await uploadAnime(name,author,type,place,language,year,img,index,link)
            this.$message.success('上传成功！');
        }
    }
};
</script>
                   