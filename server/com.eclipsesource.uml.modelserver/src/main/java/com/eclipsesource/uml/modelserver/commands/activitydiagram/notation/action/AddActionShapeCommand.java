package com.eclipsesource.uml.modelserver.commands.activitydiagram.notation.action;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;

import java.util.function.Supplier;

import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.util.EcoreUtil;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Action;

import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;

public class AddActionShapeCommand  extends UmlNotationElementCommand {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<Action> actionSupplier;

    private AddActionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.actionSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddActionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                 final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddActionShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                 final Supplier<Action> actionSupplier) {
        this(domain, modelUri, position);
        this.actionSupplier = actionSupplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            String uri = EcoreUtil.getURI(actionSupplier.get()).fragment();
            proxy.setUri(uri);
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }

}
