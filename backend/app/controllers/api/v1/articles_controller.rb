class Api::V1::ArticlesController < ApplicationController
  before_action :authenticate_api_v1_user!, only: [:show, :update, :create]

  def index
    article = Article.order(created_at: :desc)
    render json: { success: true, message: '投稿一覧です。', data: article }, include: [:user]
  end

  def show
    render json: { success: true, message: '投稿一覧です。', data: @article }, include: [:user]
  end

  def create
    article = Article.new(article_params)
    if article.save
      render json: { success: true, data: article }, include: [:user]
    else
      render json: { success: false, data: article.errors }
    end
  end

  def destroy
    @article.destroy
    render json: { success: true, message: '投稿を削除しました。', data: @article }, include: [:user]
  end

  def update
    if @article.update(article_params)
      render json: { success: true, message: '投稿を削除しました。', data: @article }, include: [:user]
    else
      render json: { success: false, message: '投稿の削除に失敗しました。', data: @article }
    end
  end

  private

  def set_article
    @article = Article.find(params[:id])
  end

  def article_params
    params.permit(:title, :body).merge(user_id: current_api_v1_user.id)
  end
end
