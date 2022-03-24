package com.eclipsesource.uml.modelserver.commands.usecasediagram.usecasepackage;

import com.eclipsesource.uml.modelserver.commands.commons.notation.UmlNotationElementCommand;
import com.eclipsesource.uml.modelserver.commands.util.UmlNotationCommandUtil;
import com.eclipsesource.uml.modelserver.unotation.SemanticProxy;
import com.eclipsesource.uml.modelserver.unotation.Shape;
import com.eclipsesource.uml.modelserver.unotation.UnotationFactory;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.glsp.graph.GPoint;
import org.eclipse.uml2.uml.Package;

import java.util.function.Supplier;

public class AddPackageShapeCommand extends UmlNotationElementCommand {

    protected final GPoint shapePosition;
    protected String semanticProxyUri;
    protected Supplier<Package> packageSupplier;

    private AddPackageShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position) {
        super(domain, modelUri);
        this.shapePosition = position;
        this.packageSupplier = null;
        this.semanticProxyUri = null;
    }

    public AddPackageShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                  final String semanticProxyUri) {
        this(domain, modelUri, position);
        this.semanticProxyUri = semanticProxyUri;
    }

    public AddPackageShapeCommand(final EditingDomain domain, final URI modelUri, final GPoint position,
                                  final Supplier<Package> packageSupplier) {
        this(domain, modelUri, position);
        this.packageSupplier = packageSupplier;
    }

    @Override
    protected void doExecute() {
        Shape newShape = UnotationFactory.eINSTANCE.createShape();
        newShape.setPosition(this.shapePosition);

        SemanticProxy proxy = UnotationFactory.eINSTANCE.createSemanticProxy();
        if (this.semanticProxyUri != null) {
            proxy.setUri(this.semanticProxyUri);
        } else {
            proxy.setUri(UmlNotationCommandUtil.getSemanticProxyUri(packageSupplier.get()));
        }
        newShape.setSemanticElement(proxy);

        umlDiagram.getElements().add(newShape);
    }
}
