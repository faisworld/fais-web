export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Widget Block */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-lg font-bold mb-2">Vapi Voice Widget</h2>
                <p className="text-sm text-gray-600">
                    Add the following snippet before the closing <code>&lt;/body&gt;</code> tag:
                </p>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
                    {`<script>
  var vapiInstance = null;
  const assistant = "<assistant_id>"; // Substitute with your assistant ID
  const apiKey = "<your_public_api_key>"; // Substitute with your Public key from Vapi Dashboard.
  const buttonConfig = {}; // Modify this as required

  (function (d, t) {
    var g = document.createElement(t),
      s = d.getElementsByTagName(t)[0];
    g.src =
      "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    g.defer = true;
    g.async = true;
    s.parentNode.insertBefore(g, s);

    g.onload = function () {
      vapiInstance = window.vapiSDK.run({
        apiKey: apiKey, // mandatory
        assistant: assistant, // mandatory
        config: buttonConfig, // optional
      });
    };
  })(document, "script");
</script>`}
                </pre>
            </div>

            {/* 4 Blocks */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">Block 1</div>
                <div className="bg-white shadow-md rounded-lg p-4">Block 2</div>
                <div className="bg-white shadow-md rounded-lg p-4">Block 3</div>
                <div className="bg-white shadow-md rounded-lg p-4">Block 4</div>
            </div>
        </div>
    );
}