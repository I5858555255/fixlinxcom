import "./footer.css";

export function Footer() {
  return (
    <footer className="dy-footer">
      <div className="dy-footer__inner">
        <p className="dy-footer__text">
          © {new Date().getFullYear()} Fixlinx Industrial Co., Ltd. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
