class QueueStore {
    constructor() {
        let topics = store.get('topics');
        if (typeof topics !== "undefined") {
            this.topics = topics;
            this.updateStore();
        } else {
            store.set('topics', {});
            this.topics = {};
        }
    }

    clear() {
        this.topics = {};
        this.updateStore();
    }

    updateStore() {
        store.set('topics', this.topics);
    }

    produce(topic, message) {
        if (!this.topics[topic]) {
            this.topics[topic] = [];
        }
        this.topics[topic].push(message);
        this.updateStore();
    }

    consume(topic, consumerFunction) {
        if (!this.topics[topic] || this.topics[topic].length === 0) {
            return;
        }
        const message = this.topics[topic].shift();
        consumerFunction(message, topic);
        this.updateStore();
    }

    subscribe(topic, consumerFunction, refresh = 1000) {
        setInterval(() => {
            this.consume(topic, consumerFunction);
        }, refresh);
    }
}