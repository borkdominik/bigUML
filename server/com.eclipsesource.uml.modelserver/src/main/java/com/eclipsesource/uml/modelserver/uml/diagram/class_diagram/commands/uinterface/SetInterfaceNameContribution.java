package com.eclipsesource.uml.modelserver.uml.diagram.class_diagram.commands.uinterface;

import org.eclipse.emf.common.command.Command;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.edit.domain.EditingDomain;
import org.eclipse.emfcloud.modelserver.command.CCommand;
import org.eclipse.emfcloud.modelserver.command.CCommandFactory;
import org.eclipse.emfcloud.modelserver.common.codecs.DecodingException;
import org.eclipse.emfcloud.modelserver.edit.command.BasicCommandContribution;
import org.eclipse.uml2.uml.Interface;

import com.eclipsesource.uml.modelserver.shared.constants.SemanticKeys;
import com.eclipsesource.uml.modelserver.shared.extension.SemanticElementAccessor;

public class SetInterfaceNameContribution extends BasicCommandContribution<Command> {

   public static final String TYPE = "class:set_interface_name";
   public static final String NEW_NAME = "new_name";

   public static CCommand create(final Interface uinterface, final String newName) {
      var command = CCommandFactory.eINSTANCE.createCommand();

      command.setType(TYPE);
      command.getProperties().put(SemanticKeys.SEMANTIC_ELEMENT_ID, SemanticElementAccessor.getId(uinterface));
      command.getProperties().put(NEW_NAME, newName);

      return command;
   }

   @Override
   protected Command toServer(final URI modelUri, final EditingDomain domain, final CCommand command)
      throws DecodingException {
      var elementAccessor = new SemanticElementAccessor(modelUri, domain);

      var semanticElementId = command.getProperties().get(SemanticKeys.SEMANTIC_ELEMENT_ID);
      var newName = command.getProperties().get(NEW_NAME);

      var uinterface = elementAccessor.getElement(semanticElementId, Interface.class);

      return new SetInterfaceNameSemanticCommand(domain, modelUri, uinterface, newName);
   }
}