package com.eclipsesource.uml.modelserver.commands.deploymentdiagram.node;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Node;

import java.util.function.Supplier;

public class AddNodeShapeCommand extends UmlNotationElementCommand {

    protected Supplier<Node> nodeSupplier;
    protected final GPoint shapePosition;
    protected String semanticProxyUri;

    private AddNodeShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.nodeSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddNodeShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                               final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddNodeShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                               final Supplier<Node> nodeSupplier) {
        this(domain, modelUri, position);
        this.nodeSupplier = nodeSupplier;

    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);
        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(nodeSupplier.get()));
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }
}
