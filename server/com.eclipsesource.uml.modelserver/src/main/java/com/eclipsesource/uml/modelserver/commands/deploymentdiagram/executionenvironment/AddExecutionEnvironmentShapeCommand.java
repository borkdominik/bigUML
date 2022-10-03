package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.executionenvironment;

import java.util.function.Supplier;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.ExecutionEnvironment;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import org.eclipse.glsp.server.emf.model.notation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

public class AddExecutionEnvironmentShapeCommand extends UmlNotationElementCommand {

    protected Supplier<ExecutionEnvironment> executionEnvironmentSupplier;
    protected final GPoint shapePosition;
    protected String semanticProxyUri;

    private AddExecutionEnvironmentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.executionEnvironmentSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddExecutionEnvironmentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddExecutionEnvironmentShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
        final Supplier<ExecutionEnvironment> executionEnvironmentSupplier) {
        this(domain, modelUri, position);
        this.executionEnvironmentSupplier = executionEnvironmentSupplier;

    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(executionEnvironmentSupplier.get()));
        }
        newShape.setSemanticElement(proxy);
        umlDiagram.getElements().add(newShape);
    }

}
