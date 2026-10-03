import { useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './HelpPanel.module.css'
import { BookOpen, CircleHelp, Lightbulb, Sparkles, X } from 'lucide-react'

export function HelpPanel() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                className={styles.helpButton}
                onClick={() => setIsOpen(true)}
                aria-label="Open documentation"
                title="VArch DSL Reference"
            >
                <CircleHelp size={16} strokeWidth={2} />

                <span>Docs</span>
            </button>

            {isOpen && createPortal(
                <div className={styles.overlay} onClick={() => setIsOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitle}>
                                <span className={styles.icon}><BookOpen size={20} strokeWidth={2} /></span>
                                <h2>VArch DSL Reference</h2>
                            </div>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                <X size={18} strokeWidth={2} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {/* Introduction */}
                            <section className={styles.section}>
                                <p className={styles.intro}>
                                    VArch is a simple DSL (Domain Specific Language) for creating architecture diagrams.
                                    Define your components and connections using intuitive syntax.
                                </p>
                            </section>

                            {/* Node Types */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    <span className={styles.badge}>1</span>
                                    Component Types
                                </h3>
                                <p className={styles.sectionDesc}>
                                    Define components using these keywords followed by an ID and optional label:
                                </p>

                                <div className={styles.syntaxGrid}>
                                    <div className={styles.syntaxCard}>
                                        <div className={styles.syntaxHeader}>
                                            <span className={styles.keyword}>db</span>
                                            <span className={styles.typeBadge}>Database</span>
                                        </div>
                                        <code className={styles.codeExample}>db mydb "User Database"</code>
                                    </div>

                                    <div className={styles.syntaxCard}>
                                        <div className={styles.syntaxHeader}>
                                            <span className={styles.keyword}>svc</span>
                                            <span className={styles.typeBadge}>Service</span>
                                        </div>
                                        <code className={styles.codeExample}>svc api "Auth Service"</code>
                                    </div>

                                    <div className={styles.syntaxCard}>
                                        <div className={styles.syntaxHeader}>
                                            <span className={styles.keyword}>ui</span>
                                            <span className={styles.typeBadge}>UI/Frontend</span>
                                        </div>
                                        <code className={styles.codeExample}>ui web "React App"</code>
                                    </div>

                                    <div className={styles.syntaxCard}>
                                        <div className={styles.syntaxHeader}>
                                            <span className={styles.keyword}>queue</span>
                                            <span className={styles.typeBadge}>Message Queue</span>
                                        </div>
                                        <code className={styles.codeExample}>queue mq "RabbitMQ"</code>
                                    </div>
                                </div>
                            </section>

                            {/* Connections */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    <span className={styles.badge}>2</span>
                                    Connections
                                </h3>
                                <p className={styles.sectionDesc}>
                                    Connect components using the arrow syntax <code className={styles.inlineCode}>-&gt;</code>:
                                </p>

                                <div className={styles.codeBlock}>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeComment}># Simple connection</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>mydb</span>
                                    </div>
                                    <div className={styles.codeLine}>&nbsp;</div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeComment}># Connection with label</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>mydb</span>
                                        <span className={styles.codeString}> "Read/Write"</span>
                                    </div>
                                    <div className={styles.codeLine}>&nbsp;</div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeComment}># Alternative: using 'connect' keyword</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>connect </span>
                                        <span className={styles.codeText}>web</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeString}> "HTTP"</span>
                                    </div>
                                </div>
                            </section>

                            {/* Annotations */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    <span className={styles.badge}>3</span>
                                    Text Annotations
                                </h3>
                                <p className={styles.sectionDesc}>
                                    Add notes or descriptions to components using the <code className={styles.inlineCode}>text</code> keyword:
                                </p>

                                <div className={styles.codeBlock}>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>text </span>
                                        <span className={styles.codeText}>mydb</span>
                                        <span className={styles.codeString}> "Stores user credentials"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>text </span>
                                        <span className={styles.codeText}>mydb</span>
                                        <span className={styles.codeString}> "500k records"</span>
                                    </div>
                                </div>
                            </section>

                            {/* Complete Example */}
                            <section className={styles.section}>
                                <h3 className={styles.sectionTitle}>
                                    <span className={styles.badge}><Sparkles size={16} /></span>
                                    Complete Example
                                </h3>

                                <div className={styles.codeBlock}>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeComment}># Define components</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>ui </span>
                                        <span className={styles.codeText}>frontend</span>
                                        <span className={styles.codeString}> "React App"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>svc </span>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeString}> "API Gateway"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>svc </span>
                                        <span className={styles.codeText}>auth</span>
                                        <span className={styles.codeString}> "Auth Service"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>db </span>
                                        <span className={styles.codeText}>users</span>
                                        <span className={styles.codeString}> "User DB"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>queue </span>
                                        <span className={styles.codeText}>events</span>
                                        <span className={styles.codeString}> "Event Bus"</span>
                                    </div>
                                    <div className={styles.codeLine}>&nbsp;</div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeComment}># Define connections</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeText}>frontend</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeString}> "REST"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>auth</span>
                                        <span className={styles.codeString}> "Validate"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeText}>auth</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>users</span>
                                        <span className={styles.codeString}> "Query"</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeText}>api</span>
                                        <span className={styles.codeArrow}> -&gt; </span>
                                        <span className={styles.codeText}>events</span>
                                        <span className={styles.codeString}> "Publish"</span>
                                    </div>
                                    <div className={styles.codeLine}>&nbsp;</div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeComment}># Add annotations</span>
                                    </div>
                                    <div className={styles.codeLine}>
                                        <span className={styles.codeKeyword}>text </span>
                                        <span className={styles.codeText}>users</span>
                                        <span className={styles.codeString}> "PostgreSQL"</span>
                                    </div>
                                </div>
                            </section>

                            {/* Tips */}
                            <section className={styles.section}>
                                <div className={styles.tipBox}>
                                    <span className={styles.tipIcon}><Lightbulb size={20} /></span>
                                    <div>
                                        <strong>Pro Tips:</strong>
                                        <ul className={styles.tipList}>
                                            <li>IDs must be alphanumeric (letters, numbers, underscores)</li>
                                            <li>Labels in quotes are optional - ID will be used if omitted</li>
                                            <li>Empty lines are ignored - use them to organize your code</li>
                                            <li>Changes update the diagram in real-time!</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
