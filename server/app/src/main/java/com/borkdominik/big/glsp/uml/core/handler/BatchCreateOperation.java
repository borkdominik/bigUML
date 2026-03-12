package com.borkdominik.big.glsp.uml.core.handler;

import java.util.List;

import org.eclipse.glsp.server.operations.Operation;

public class BatchCreateOperation extends Operation {
    public static final String KIND = "batchCreate";

    private List<BatchOperation> operations;

    public BatchCreateOperation() {
        super(KIND);
    }

    public BatchCreateOperation(List<BatchOperation> operations) {
        super(KIND);
        this.operations = operations;
    }

    public List<BatchOperation> getOperations() {
        return operations;
    }
}
