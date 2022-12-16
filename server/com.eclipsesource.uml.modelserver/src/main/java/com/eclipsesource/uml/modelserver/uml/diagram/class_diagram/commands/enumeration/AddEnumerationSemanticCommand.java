package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.enumeration;

import org.eclipse.uml2.uml.Enumeration;
import org.eclipse.uml2.uml.UMLFactory;

import com.eclipsesource.uml.modelserver.shared.model.ModelContext;
import com.eclipsesource.uml.modelserver.shared.semantic.UmlSemanticElementCommand;
import com.eclipsesource.uml.modelserver.uml.generator.NameGenerator;
import com.eclipsesource.uml.modelserver.uml.generator.PackageableElementNameGenerator;

public class AddEnumerationSemanticCommand extends UmlSemanticElementCommand {

   protected final Enumeration newEnumeration;
   protected final NameGenerator nameGenerator;

   public AddEnumerationSemanticCommand(final ModelContext context) {
      super(context);
      this.newEnumeration = UMLFactory.eINSTANCE.createEnumeration();
      this.nameGenerator = new PackageableElementNameGenerator(context, Enumeration.class);
   }

   @Override
   protected void doExecute() {
      newEnumeration.setName(nameGenerator.newName());
      model.getPackagedElements().add(newEnumeration);
   }

   public Enumeration getNewEnumeration() { return newEnumeration; }
}
