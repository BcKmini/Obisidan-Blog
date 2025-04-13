import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CommentSection({ observationId }) {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/comments/${observationId}`);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (observationId) {
      fetchComments();
    }
  }, [observationId]);

  const handleAddComment = async () => {
    if (!username || !content) {
      alert("이름과 댓글 내용을 입력하세요.");
      return;
    }
    try {
      await axios.post("http://localhost:4000/comments", {
        observation_id: observationId,
        username,
        content
      });
      setUsername("");
      setContent("");
      // 다시 목록 불러오기
      const res = await axios.get(`http://localhost:4000/comments/${observationId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
      alert("댓글 등록 오류");
    }
  };

  const commentCount = comments.length;

  return (
    <div style={{ marginTop: "30px", backgroundColor: "#f9f9f9" }}>
      {/* 상단 - 댓글달기 / 이름제안 */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        background: "#eee", 
        padding: "10px 16px", 
        fontSize: "14px", 
        fontWeight: "bold",
        borderTop: "1px solid #ddd",
        borderLeft: "1px solid #ddd",
        borderRight: "1px solid #ddd",
      }}>
        <span>댓글달기 {commentCount}</span>
        <span>이름제안 0</span>
      </div>

      {/* 댓글 목록 */}
      <div style={{
        border: "1px solid #ddd", 
        borderTop: "none", 
        padding: "16px", 
        fontSize: "14px"
      }}>
        {comments.length === 0 ? (
          <div style={{ color: "#999", marginBottom: "10px" }}>등록된 댓글이 없습니다.</div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              style={{ 
                marginBottom: "16px", 
                background: "#fff", 
                borderRadius: "4px",
                padding: "12px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
              }}
            >
              {/* 작성자 영역 */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "6px" }}>
                {/* 예: 프로필 이미지 등 추가하고 싶다면 <img src="..." style={{borderRadius:'50%', width:'30px', height:'30px'}} /> */}
                <div style={{ fontWeight: "bold", marginRight: "8px" }}>{comment.username}</div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {new Date(comment.created_at).toLocaleString()}
                </div>
              </div>
              {/* 댓글 내용 */}
              <div style={{ marginLeft: "2px", lineHeight: "1.4" }}>
                {comment.content}
              </div>
            </div>
          ))
        )}

        {/* 입력 영역 */}
        <div style={{ marginTop: "12px" }}>
          {/* 이름 입력 */}
          <div style={{ marginBottom: "8px" }}>
            <input
              type="text"
              placeholder="이름"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                display: "block",
                width: "200px",
                padding: "8px",
                marginBottom: "4px",
                border: "1px solid #ccc",
                borderRadius: "4px"
              }}
            />
          </div>
          {/* 댓글 입력 + 버튼 */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <textarea
              placeholder="댓글을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={2}
              style={{
                flex: 1,
                resize: "none",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px"
              }}
            />
            <button
              onClick={handleAddComment}
              style={{
                padding: "8px 16px",
                backgroundColor: "#eee",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              게시
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
